locals {
  api_origin_id = "bcer-api-${var.target_env}"
}

provider "aws" {
  alias = "us-east-1"
  region = "us-east-1"
}

data "aws_acm_certificate" "bcer_api_certificate" {
  provider = aws.us-east-1
  domain = "bcer-${var.target_env}.api.hlth.gov.bc.ca"
  statuses = ["ISSUED"]
  most_recent = true
}


data "aws_cloudfront_cache_policy" "Managed-CachingOptimized" {
  name = "Managed-CachingOptimized"
}


resource "aws_cloudfront_distribution" "api_distribution" {
  origin {
    domain_name = "bcer-api.${data.aws_caller_identity.current.account_id}-${var.target_env}.nimbus.cloud.gov.bc.ca"
    origin_id   = local.api_origin_id
    origin_shield {
      enabled = true
      origin_shield_region = "us-east-1"
    }
    custom_origin_config {
      http_port = 80
      https_port = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols = ["TLSv1.2"]
    }
  }
  enabled             = true
  is_ipv6_enabled     = true
  aliases = ["bcer-${var.target_env}.api.hlth.gov.bc.ca"]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.api_origin_id
    cache_policy_id = data.aws_cloudfront_cache_policy.Managed-CachingOptimized.id
    compress = true
    

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }
  price_class = "PriceClass_100"
  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["CA"]
    }
  }

#   tags = {
#     Environment = "development"
#     Name        = "my-tag"
#   }

  viewer_certificate {
    acm_certificate_arn = data.aws_acm_certificate.bcer_api_certificate.arn
    minimum_protocol_version = "TLSv1.2_2021"
    ssl_support_method = "sni-only"
  }
}