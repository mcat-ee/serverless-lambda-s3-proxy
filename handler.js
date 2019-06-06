'use strict';

var fs = require('fs');

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

var defaultPageKey = "index";
var bucketName = "big-ol-test-bucket";

const mappings = {
	'binary/octet-stream': 'text/html',
	'image/jpeg':'image/jpeg',
	'image/x-icon': 'image/x-icon'
};

function get_file(key) {
	console.log("MARKER");
	// console.log(process.env);
	console.log("Accessing... " + bucketName);
	console.log("Trying file '" + key + "'");
	return new Promise(function(resolve,reject) {
		s3.getObject({
        Bucket: bucketName,
        Key: key
      }, function(err,data) {
	        if(err) {
	            console.log(err, err.stack);
	            reject(err);
	        } else {
	        	console.log("Retrieved item");

	            resolve(data);
	        }
      	});
	});
}



module.exports.serve_file_from_s3 = (event, context, callback) => {
	// console.log(event);
	console.log('marker');
	const filename = event.pathParameters ? event.pathParameters.path : defaultPageKey;	//TODO force a refresh instead

	get_file(filename)
		.then(result => {
			console.log("...then(");
			console.log(result);
			// var mimeType = result.Headers[result.Headers.ContentType];
			const contentType = result.ContentType;

			const jsonRegex = /[Jj][Ss][Oo][Nn]/
			const textRegex = /[Tt][Ee][Xx][Tt]/
			const octetRegex = /octet/;

			const response = {
				statusCode: 200,
                headers: {
                 	// 'Content-Type': mapping[contentType],
                 	'Content-Type': contentType,
                },
			}

			console.log("assembling response...");
			console.log(response);

			if( jsonRegex.test(contentType) || textRegex.test(contentType) || octetRegex.test(contentType))	//If 'Ttext' or 'jJsSoOnN' 
			{
				console.log("Returning ASCII data");
				response.body = result.Body.toString('ascii');

				// response.isBase64Encoded = false;
			} else {
			// 	//Return binary data
				console.log("Returning binary data");
				response.body = result.Body.toString('base64');
				response.isBase64Encoded = true;
			}
			
            // console.log(response);
            // console.log("MIME TYPE:" + mimeType);
            // if(mimeType) {
            // 	response.headers['Content-Type'] = mimeType;
            // }
            callback(null, response);
		})
		.catch(err => {
				const response = {
	                statusCode: 404,
	                headers: {
	                	'Content-Type': "text/html",
	                },
	                body: JSON.stringify(err),
	            };
	            callback(null, response);
		});
}
