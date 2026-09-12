import mongoose, { Document, Schema } from "mongoose";

export interface IProductVariant {
  size: string;
  price: number;
  stock: number;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  category: string;
  images: string[];
  variants: IProductVariant[];
  colors: string[];
  isNewArrival: boolean;
  isFeatured: boolean;
  isActive: boolean;
}

const productVariantSchema = new Schema<IProductVariant>(
  {
    size: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    images: {
      type: [String],
      required: true,
      default: [],
    },

    variants: {
      type: [productVariantSchema],
      required: true,
      default: [],
    },

    colors: {
      type: [String],
      default: [],
    },

    isNewArrival: {
      type: Boolean,
      default: false,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<IProduct>(
  "Product",
  productSchema
);

export default Product;