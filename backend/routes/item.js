
import express from "express";
import multer from "multer";
import {getItemsByCategory,uploadItem, updateItemDetails, buyItem, addFavoriteItem, removeFavoriteItem, getFavItems, getItemById, isFavItem, getUserItems, getUploads, getOrders, deleteItem, autocomplete } from '../controllers/item.js';

const router = express.Router();

const itemUpload = multer({ dest: 'uploads/' });

router.get('/items/:category', getItemsByCategory);
router.post("/uploadItem", itemUpload.array("images", 4),uploadItem);
router.post("/updateItemDetails", itemUpload.array("images", 4), updateItemDetails);
router.post("/buyItem", buyItem);
router.post("/addFavoriteItem", addFavoriteItem);
router.delete("/removeFavoriteItem", removeFavoriteItem);
router.get("/getFavItems", getFavItems);
router.get("/getItemById", getItemById);
router.get("/isFavItem", isFavItem);
router.get("/getUserItems", getUserItems);
router.get("/getUploads", getUploads);
router.get("/getOrders", getOrders);
router.delete("/deleteItem", deleteItem);
router.get("/autocomplete", autocomplete);


export default router;
