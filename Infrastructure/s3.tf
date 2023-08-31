resource "aws_s3_bucket" "sql_scripts" {
  bucket = "${data.aws_caller_identity.current.account_id}-sql-scripts"
}


resource "aws_s3_bucket" "static" {
  bucket = "bcer-${var.target_env}"

  # tags = {
  #   Environment = "development"
  #   Name        = "my-tag"
  # }

}


data "aws_iam_policy_document" "s3_policy" {
  statement {
    actions = ["s3:GetObject",
    "s3:ListBucket"]
    resources = ["${aws_s3_bucket.static.arn}/*",
    "${aws_s3_bucket.static.arn}"]
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = ["${aws_cloudfront_distribution.s3_distribution.arn}"]
    }
  }
}

resource "aws_s3_bucket_policy" "cloudfront-s3-access" {
  bucket = aws_s3_bucket.static.id
  policy = data.aws_iam_policy_document.s3_policy.json
}