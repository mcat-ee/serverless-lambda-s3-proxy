
# Things that must be calibrated for your setup:

1. Please change the names on the rows with TODO in them. bucketName is the name used for an s3 bucket that will hold all the assets to be served.
2. Export bucketName in your bash terminal ('export bucketName=<bucket name>')
3. Run the sync_assets.sh script to copy the contents of the assets directory to the s3 bucket

# Random Notes

* There is no 'node_modules' directory as aws-sdk is the only dependency (and this is available to Lambda functions natively)

* If html files are not using a .html file extension, their content type must be manually set in S3 (else they will trigger a 'download')


# TODO

1. Binary octet override for text/html
