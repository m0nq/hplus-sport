// JSON containing schema for product data

const productSchema = {
  "$schema": "http://json-schema.org/draft-07/schema",
  "id": "http://example.com/schemas/products.json",
  "title": "h+ sports products",
  "description": "schema for h+ sport product data",
  "type": "object",
  "properties": {
    "products": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "image": {
            "type": "string"
          },
          "alt": {
            "type": "string"
          }
        }
      }
    }
  }
};
