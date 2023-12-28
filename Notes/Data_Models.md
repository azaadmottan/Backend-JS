# Mongoose:

In Mongoose, when you define a model, it automatically converts the provided model name to 'lowercase' and 'pluralizes' it to determine the collection name in the 'MongoDB' database. 

This behavior is part of Mongoose's convention for creating collections based on models.

## Lowercase Model Name:

- Mongoose converts the model name to lowercase to maintain 'consistency' and avoid 'potential issues' with 'case sensitivity' in 'MongoDB'.

- MongoDB collection names are case-sensitive. By converting the model name to lowercase, Mongoose ensures that the collection name is consistently represented in a case-insensitive manner.


## Pluralization:

- Mongoose automatically 'pluralizes' the lowercase model name to create the corresponding 'collection name' in MongoDB.

- Pluralizing the collection name makes it more 'readable' and 'aligns with the convention' of using plural names for collections in MongoDB.

Example 

```Javascript
    const mongoose = require('mongoose');

    const User = mongoose.model('User', {
        name: String,
        email: String
    });

    // Mongoose will create a collection named 'users' in the MongoDB database
```

In this example, even if you provide the model name as 'User' (with an uppercase 'U'), Mongoose will convert it to lowercase and pluralize it to create the 'users' collection.


## If you want to explicitly specify the collection name in Mongoose, you can do so by passing a third argument to the mongoose.model function:

Example 

```Javascript
    const MyModel = mongoose.model('ModelName', mySchema, 'customCollectionName');
```

In the above example, the collection name will be explicitly set to 'customCollectionName' instead of being automatically generated based on the model name.