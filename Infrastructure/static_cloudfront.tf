locals {
  s3_origin_id = "bcer-${var.target_env}"
}

provider "aws" {
  alias  = "us-east-1"
  region = "us-east-1"
}

data "aws_acm_certificate" "bcer_certificate" {
  provider    = aws.us-east-1
  domain      = var.application_url
  statuses    = ["ISSUED"]
  most_recent = true
}

resource "aws_cloudfront_function" "redirect" {
  name    = "indexRedirect"
  runtime = "cloudfront-js-1.0"
  comment = "Redirect all requests to index.html"
  publish = true
  code    = file("redirect.js")
}

data "aws_cloudfront_cache_policy" "Managed-CachingOptimized" {
  name = "Managed-CachingOptimized"
}

resource "aws_cloudfront_origin_access_control" "bcer" {
  name                              = "bcer-${var.target_env}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name              = aws_s3_bucket.static.bucket_regional_domain_name
    origin_id                = local.s3_origin_id
    origin_access_control_id = aws_cloudfront_origin_access_control.bcer.id
    origin_shield {
      enabled              = true
      origin_shield_region = "us-east-1"
    }
  }
  default_root_object = "index.html"
  enabled             = true
  is_ipv6_enabled     = true
  aliases             = [var.application_url]

  default_cache_behavior {
    target_origin_id       = local.s3_origin_id
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    viewer_protocol_policy = "redirect-to-https"
    cache_policy_id        = data.aws_cloudfront_cache_policy.Managed-CachingOptimized.id
    compress               = true
    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.redirect.arn
    }
    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400
  }

  ordered_cache_behavior {
    path_pattern           = "/retailer*"
    target_origin_id       = aws_s3_bucket.static.id
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    viewer_protocol_policy = "redirect-to-https"
    cache_policy_id        = data.aws_cloudfront_cache_policy.Managed-CachingOptimized.id
    compress               = true
    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.redirect.arn
    }
  }

  ordered_cache_behavior {
    path_pattern           = "/portal*"
    target_origin_id       = aws_s3_bucket.static.id
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    viewer_protocol_policy = "redirect-to-https"
    cache_policy_id        = data.aws_cloudfront_cache_policy.Managed-CachingOptimized.id
    compress               = true
    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.redirect.arn
    }
  }

  price_class = "PriceClass_100"
  custom_error_response {
    error_code         = 404
    response_page_path = "/404.html"
    response_code      = 404
  }
  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["CA"]
    }
  }

  viewer_certificate {
    acm_certificate_arn      = data.aws_acm_certificate.bcer_certificate.arn
    minimum_protocol_version = "TLSv1.2_2021"
    ssl_support_method       = "sni-only"
  }
}

# to get the Cloud front URL if doamin/alias is not configured
output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.s3_distribution.domain_name
}
