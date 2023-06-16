import multer from 'multer';
import fs from 'fs';
import { google } from 'googleapis';
import { ComputerVisionClient } from "@azure/cognitiveservices-computervision";
import { ApiKeyCredentials } from "@azure/ms-rest-js";
import { ClarifaiStub, grpc } from 'clarifai-nodejs-grpc';
import { Configuration, OpenAIApi } from "openai";
/*
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the destination folder to save the uploaded images
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${Date.now()}-${file.originalname}`; // Append original file name as a unique identifier
    cb(null, uniqueFilename); // Set a unique filename for the uploaded image
  },
});

const upload = multer({ storage });*/

const GOOGLE_API_FOLDER_ID = '16-kMzJPiwurJ1doLa7mNjFc6hUs_c0Ig';

// Function to upload a file to Google Drive
async function uploadFileToDrive(file) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: './googlekey.json',
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const driveService = google.drive({
      version: 'v3',
      auth,
    });

    const fileMetadata = {
      name: file.originalname,
      parents: [GOOGLE_API_FOLDER_ID],
    };

    const media = {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.path),
    };

    const response = await driveService.files.create({
      auth,
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });

    console.log(response.data.id);
    return response.data.id;
  } catch (err) {
    console.log('Upload file error', err);
  }
}

export { /*upload,*/ uploadFileToDrive };


// Replace with your own endpoint and access key
const endpoint = "https://visioninbalnoa.cognitiveservices.azure.com/";
const accessKey = "d5f5ec9903af476bb0fa2a05baf1ecde";

const credentials = new ApiKeyCredentials({ inHeader: { "Ocp-Apim-Subscription-Key": accessKey } });
const client = new ComputerVisionClient(credentials, endpoint);

// Function to capture an image
export async function captureImage(imageFile, category, color) {
  try {
    // Read the image file
    const imageBuffer = fs.readFileSync(imageFile);

    // Perform the image analysis using ComputerVisionClient
    const result = await client.analyzeImageInStream(imageBuffer, { visualFeatures: ["Tags", "Description"] });

    // Process the result
    /*console.log("Tags:");
    result.tags.forEach((tag) => console.log(tag.name));*/
    console.log("Description:");
    //result.description.forEach((caption) => console.log(caption.text));
    console.log(result.description.captions[0].text);
    ///////////////////////////// description
    
    const description = result.description.captions[0].text;

    // Find the index of the phrase "on a"
    const onAIndex = description.indexOf("on a");

    let cleanedDescription;

    if (onAIndex !== -1) {
      // Remove the portion of the sentence after "on a" using substring
      cleanedDescription = description.substring(0, onAIndex).trim();
    } else {
      const fromAIndex = description.indexOf("from a");
      if(fromAIndex !== -1){
        // Remove the portion of the sentence after "on a" using substring
        cleanedDescription = description.substring(0, fromAIndex).trim();
      }
      else{
        // Keep the entire sentence
        cleanedDescription = description;
      }
    }

    let modifiedDescription = cleanedDescription;
    if (cleanedDescription.startsWith("a close-up of a ")) {
      modifiedDescription = cleanedDescription.substring(cleanedDescription.indexOf(" ") + 15);
    }
    else if (cleanedDescription.startsWith("a stack of ")) {
      modifiedDescription = cleanedDescription.substring(cleanedDescription.indexOf(" ") + 10);
    }
    else if(cleanedDescription.startsWith("a woman's hand holding a ")){
      modifiedDescription = cleanedDescription.substring(cleanedDescription.indexOf(" ") + 24);
    }
    else if(cleanedDescription.startsWith("a group of ")){
      console.log("here!");
      modifiedDescription = cleanedDescription.split("of ")[1].trim();
    }
    else if (cleanedDescription.startsWith("a ")) {
      modifiedDescription = cleanedDescription.substring(cleanedDescription.indexOf(" ") + 1);
    }
    
    if (modifiedDescription.startsWith("pair of ") && category == "skirts") {
      const searchPattern = "pair of";
      const replacement = "skirt";

      modifiedDescription = modifiedDescription.replace(searchPattern, "").trim() + " " + replacement;
      console.log(modifiedDescription);
    }

   

    console.log("cleaned : " +modifiedDescription);

    let itemCategory;
    if (category == "dresses"){
      itemCategory = "dress";
    }
    if (category == "tops"){
      itemCategory = "top";
    }
    if (category == "skirts"){
      itemCategory = "skirt";
    }
    if (category == "pants"){
      itemCategory = "pants";
    }

    const wordList = ["fabric", "hat","book", "pillow", "rectangle", "garment", "cloth", "dress", "shirt", "pants","diapers","diaper","ball","flag", "bracelet", "necklace", "tie", "towels","towel", "purse", "cylindrical", "object","bag", "underwear", "puzzle", "piece", "toilet", "paper", "roll", "candy", "bars"];

    let numberOfWords = 0;
    let cutSentence = false;
    const updatedSentence = modifiedDescription
      .split(" ")
      .map((word) => {
        if (cutSentence) {
          return "";
        }
    
        if (wordList.includes(word.toLowerCase())) {
          if ((category == "top" && (word == "shirt" || word == "t-shirt")) || (category == "pants" && word == "shorts")) {
            return word;
          }
          if(word == "piece"){
            cutSentence = true;
            return itemCategory;
          }
    
          numberOfWords = numberOfWords + 1;
          if (numberOfWords === 1) {
            return itemCategory;
          } else if (numberOfWords === 2) {
            cutSentence = true;
            return "";
          }
        }
        return word;
      })
      .join(" ");

    const pattern1 = `with a white background`;
    const pattern2 = `with a strap`;
    const pattern3 = `over her head`;

    const veryUpdatedSentence = updatedSentence.replace(pattern1, "").replace(pattern2, "").replace(pattern3, "");
    var finalDesctiption = veryUpdatedSentence;
    if(color !== ""){
      finalDesctiption = await runPrompt(veryUpdatedSentence, color);
    }
    
    console.log("final : " + finalDesctiption);

    return finalDesctiption;
  } catch (error) {
    console.error("An error occurred during image capture:", error);
  }
}



const config = new Configuration({
	apiKey: `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`,
});

const openai = new OpenAIApi(config);
export const runPrompt = async (description, color) => {
  console.log(description, color);
	const prompt = `
    please answer only with the updated description. without additions!! 
    i will give you description of AI about a cloth, and color that i (truth telling) write about the cloth. if there is a contradiction between the color in the description to the color that i wrote, please fix it according to the color that i wrote.  if the color doesn't appear in the description, add it!
    description: blue dress
    color: white
    for this the updated description (and what i want you to reply), will be exactly this: white dress
    if there is not a contradiction, return me the description. 
    description: ${description}
    color: ${color}
    `;

	const response = await openai.createCompletion({
		model: "text-davinci-003",
		prompt: prompt,
		max_tokens: 2048,
		temperature: 1,
	});

	const chatUpdatedDescription = response.data.choices[0].text;
  let updated = chatUpdatedDescription;
  if(updated.includes(":")){
    updated = updated.split(":")[1].trim();
  }
  if (updated.endsWith(".")) {
    updated = updated.slice(0, -1);
  }
  
  return updated;
  
};


/* Clarifai labels for image */
const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key 75f1751d1d244811b2b9d3b4d239de76");

export function predictImage(inputs){
  return new Promise((resolve, reject) =>{
    stub.PostModelOutputs(
      {
          // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
          model_id: "aaa03c23b3724a16a56b629203edc62c",
          inputs: inputs
      },
      metadata,
      (err, response) => {
          if (err) {
              reject("Error: " + err);
              return;
          }
  
          if (response.status.code !== 10000) {
              console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
              return;
          }
          let results = [];
          for (const c of response.outputs[0].data.concepts) {
              const ignoreLabels = ["no person", "fashion", "wear", "cutout", "one","winter", "isolated", "model", "architecture", "wood", "indoors","people","portrait", "facial expression", "adult", "girl", "kitchenware", "happiness", "room", "creativity", "child", "looking", "brunette", "enjoyment", "cooking", "family", "person", "illustration", "desktop","vector"]
              if(!ignoreLabels.includes(c.name) && c.value >= 0.9){
                //console.log(c.name + ": " + c.value);
                results.push({
                  name: c.name,
                  value: c.value
                })
              }
          }
          resolve(results);
      }
  );
  })
}