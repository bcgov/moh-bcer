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
resource "aws_cloudwatch_log_group" "bcer_api_access_logs" {
  name = "bcer-${var.target_env}-api-gateway"
  retention_in_days = 90
}

module "api_gateway" {
  source = "terraform-aws-modules/apigateway-v2/aws"
  version = "2.2.2"

  name          = "${var.application}-http-api"
  description   = "HTTP API Gateway"
  protocol_type = "HTTP"
  create_api_domain_name = false

  domain_name                 = "bcer-${var.target_env}.api.hlth.gov.bc.ca"
  domain_name_certificate_arn = data.aws_acm_certificate.bcer_api_certificate.arn
  default_stage_access_log_destination_arn = aws_cloudwatch_log_group.bcer_api_access_logs.arn
  
#   default_route_settings = {
#     detailed_metrics_enabled = true
#     throttling_burst_limit   = 100
#     throttling_rate_limit    = 100
#   }

  integrations = {

    "ANY /{proxy+}" = {
      connection_type = "VPC_LINK"
      vpc_link = "bcer-vpc"
      integration_uri = "arn:aws:elasticloadbalancing:ca-central-1:705490038982:listener/app/default/35426aefceba87be/72d3ccfa5faf7163"
      integration_type = "HTTP_PROXY"
      integration_method = "ANY"
    }
  }
  vpc_links = {
    bcer-vpc = {
      name               = "${var.application}-vpc-link"
      security_group_ids = [data.aws_security_group.web.id]
      subnet_ids         = data.aws_subnets.web.ids
    }
  }

#   tags = {
#     Name = "dev-api-new"
#   }
}
