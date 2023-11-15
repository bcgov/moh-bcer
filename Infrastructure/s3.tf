resource "aws_s3_bucket" "sql_scripts" {
  bucket = "705490038982-sql-scripts"  
}


resource "aws_s3_bucket" "static" {
  bucket = "bcer-dev"

  # tags = {
  #   Environment = "development"
  #   Name        = "my-tag"
  # }

}

resource "aws_s3_bucket_website_configuration" "static_bcer" {
  bucket = aws_s3_bucket.static.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_acl" "bcer_static" {
  bucket = aws_s3_bucket.static.id
  acl    = "private"
}

resource "aws_s3_bucket_versioning" "bcer_static" {
  bucket = aws_s3_bucket.static.id
  versioning_configuration {
    status = "Enabled"
  }
}