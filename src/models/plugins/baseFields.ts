import type {Schema} from "mongoose";


//this gives all models timestamps

export function baseFields(schema: Schema) {
    schema.add({
        deletedAt: {type: Date, default: null},
    })
    schema.set("timestamps", true);
}