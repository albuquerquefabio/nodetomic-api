import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import { registerEvents } from '../events/example.events';
const Schema = mongoose.Schema;

const ExampleSchema = new Schema({
  greet: {
    type: String,
    required: [true, 'Greet is required.']
  },
  language: {
    type: String,
    required: [true, 'Language is required.']
  }
});
registerEvents(ExampleSchema);
ExampleSchema.plugin(mongoosePaginate);

export default mongoose.model('Example', ExampleSchema);