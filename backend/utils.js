import multer from 'multer';
import fs from 'fs';
import { google } from 'googleapis';
import { ComputerVisionClient } from "@azure/cognitiveservices-computervision";
import { ApiKeyCredentials } from "@azure/ms-rest-js";
import { ClarifaiStub, grpc } from 'clarifai-nodejs-grpc';
import { Configuration, OpenAIApi } from "openai";

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

export { uploadFileToDrive };


// Replace with your own endpoint and access key
const endpoint = "https://visioninbalnoa.cognitiveservices.azure.com/";
const accessKey = process.env.AZURE_KEY;

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
    console.log("Description:");
    console.log(result.description.captions[0].text);
    
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

   /* const wordList = ["fabric", "hat","book", "pillow", "rectangle", "garment", "cloth", "dress", "shirt", "pants","diapers","diaper","ball","flag", "bracelet", "necklace", "tie", "towels","towel", "purse", "cylindrical", "object","bag", "underwear", "puzzle", "piece", "toilet", "paper", "roll", "candy", "bars"];

    let numberOfWords = 0;
    const wordList = [];
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

    const veryUpdatedSentence = updatedSentence.replace(pattern1, "").replace(pattern2, "").replace(pattern3, "");*/
    //var finalDesctiption = veryUpdatedSentence;
    const veryUpdatedSentence = modifiedDescription;
    var finalDesctiption = modifiedDescription;
    //if(color !== ""){
      console.log(color)

      finalDesctiption = await runPrompt(veryUpdatedSentence,itemCategory, color);
    //}
    
    console.log("final : " + finalDesctiption);

    return finalDesctiption;
  } catch (error) {
    console.error("An error occurred during image capture:", error);
  }
}



const config = new Configuration({
	apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(config);
export const runPrompt = async (description, category, color) => {
  console.log(description, category, color);
	const prompt = `
    A user has uploaded an item to the second-hand clothes store website. The initial description generated by the capture image API of Azure Vision may contain contradictions with the real category or color provided by the user. I need your assistance in updating the description to resolve any contradictions and ensure accuracy. But if there are more adjectives in the description, not including the color, dont remove those. And if there are details about things that cannot be, like skirt with strap, please remove them, and also remove details about other things in the image, that are not related to the cloth. Please do not include unnecessary details on the photo that are not related to the description of the appearance of the cloth! The description is about a single cloth item and not many Refer to it in the singular, accordingly. It should be a very short sentence about the cloth item, like is color and maybe if it has text on it, flowers or something like this. do not add unneccessery details!! Please do not provide details about the item that are not included in the description, color and category!!! without "A" in the beggining of the updated description. If the item in the attached description is a shirt or t-shirt, and the category is top, so in updated description call it as it is in the attached description - shirt/t-shirt.
    Initial Description: ${description}
    Real Category: ${category}
    Real Color: ${color}
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
metadata.set("authorization", `Key ${process.env.CLARIFAI_KEY}`);

export function predictImage(inputs){
  return new Promise((resolve, reject) =>{
    stub.PostModelOutputs(
      {
          // This is the model ID of a publicly available General model.
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