resource "aws_cloudwatch_log_group" "ecs_monitoring" {
  name = "ecs-monitoring"
  retention_in_days = "731"
}

resource "aws_ecs_cluster" "bcer_cluster" {
  name = "bcer_cluster"
}

resource "aws_ecs_cluster_capacity_providers" "bcer_cluster" {
  cluster_name               = aws_ecs_cluster.bcer_cluster.name
  capacity_providers = ["FARGATE"]

  default_capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight            = 100

  }
}
#difference between task and execution roles
resource "aws_ecs_task_definition" "bcer_td" {
  family                   = "bcer-${var.target_env}-task"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_execution_role.arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.fargate_cpu
  memory                   = var.fargate_memory
  tags                     = local.common_tags
  container_definitions = jsonencode([
    {
      essential   = true
      name        = "bcer-${var.target_env}-definition"
      #change to variable to env. for GH Actions
      image       = "705490038982.dkr.ecr.ca-central-1.amazonaws.com/bcer-api:latest"
      cpu         = var.fargate_cpu
      memory      = var.fargate_memory
      networkMode = "awsvpc"
      portMappings = [
        {
          protocol      = "tcp"
          containerPort = var.app_port
          hostPort      = var.app_port
        }
      ]
      secrets = [
        {"name": "DB_USERNAME", 
         "valueFrom": "${aws_secretsmanager_secret_version.rds_credentials.arn}:username::"},
        {"name": "DB_PASSWORD", 
         "valueFrom": "${aws_secretsmanager_secret_version.rds_credentials.arn}:password::"},
        {"name": "DB_HOST", 
         "valueFrom": "${aws_secretsmanager_secret_version.rds_credentials.arn}:host::"},
         {"name": "DB_PORT",
         "valueFrom": "${aws_secretsmanager_secret_version.rds_credentials.arn}:port::"}
         ]
      environment = [
         {"name": "APPLICATION_PORT",
         "value": "4000"},
         {"name": "AWS_ENV",
         "value": "true"},
         {"name": "BC_DIRECTION_API_KEY",
         "value": "true"},
         {"name": "BC_DIRECTION_API_KEY",
         "value": "11dd756f680c47b5aef5093d95543738"},
         {"name": "CLOSE_LOCATION_CRON_TIME",
         "value": "0 1 16 2 *"},
         {"name": "CRON_JOB_NAMES",
         "value": "SEND_NOTIFICATION"},
         {"name": "DB_DATABASE",
         "value": "bcerd"},
         {"name": "DB_SCHEMA",
         "value": "bcer"},
         {"name": "DB_TEST_DATABASE",
         "value": "nest_api_test"},
         {"name": "EMAIL_GENERIC_NOTIFICATION_TEMPLATE_ID",
         "value": "b0e11803-ee8e-457d-a6e4-faad527edf68"},
         {"name": "ENABLE_SUBSCRIPTION",
         "value": "true"},
         {"name": "ENABLE_TEXT_MESSAGES",
         "value": "true"},
         {"name": "GA_KEY",
         "value": "AIzaSyBLX_40ZbEOvxrPctDCnAQOcs5G8tTxLfk"},
         {"name": "HEAPSNAPSHOT_ENABLED",
         "value": "false"},
         {"name": "KEYCLOAK_AUTH_URL",
          "value": "https://common-logon-test.hlth.gov.bc.ca/auth/"},
          {"name": "KEYCLOAK_CLIENT",
          "value": "BCER"},
          {"name": "KEYCLOAK_DATA_AUTH_URL",
          "value": "https://common-logon-test.hlth.gov.bc.ca/auth/"},
          {"name": "KEYCLOAK_DATA_CLIENT",
          "value": "BCER-CP"},
          {"name": "KEYCLOAK_DATA_REALM",
          "value": "moh_applications"},
          {"name": "KEYCLOAK_PORT",
          "value": "443"},
          {"name": "KEYCLOAK_REALM",
          "value": "bcer"},
          {"name": "LOAD_CERTS",
          "value": "false"},
          {"name": "LOGS_PATH",
          "value": "./../logs"},
          {"name": "MAP_BOX_ACCESS_TOKEN",
          "value": "pk.eyJ1Ijoic2FnYXJiaHAiLCJhIjoiY2t4YjNlZXMyM3VkbTJvcTMwYW5rbmRjbSJ9.j7i9KaoFeFHjerA8DcdDCw"},
          {"name": "NOI_EXPIRY_DATE",
          "value": "10-01"},
          {"name": "PEM_CERT_PATH",
          "value": "../keys/bcer-dev.hlth.gov.bc.ca.crt"},
          {"name": "PEM_KEY_PATH",
          "value": "../keys/bcer-dev.hlth.gov.bc.ca.key"},
          {"name": "SALES_REPORT_END_DATE",
          "value": "09-30"},
          {"name": "TEXT_API_KEY",
          "value": "bcertestnotificationservicekey-8d304d1f-3230-4497-ac29-777725ddd287-2bb83e07-6f3a-4e23-ae44-cc3dcdfca4a1"},
          {"name": "TEXT_API_PROXY",
          "value": "apiproxyd.hlth.gov.bc.ca"},
          {"name": "TEXT_GENERIC_NOTIFICATION_TEMPLATE_ID",
          "value": "fd45cc5f-6ba7-4d82-9b7f-45525918344d"},
          {"name": "VAPING_NOTIFICATION_EMAIL",
          "value": "adam.hoplock@gov.bc.ca"}
      ]       

      
      #change awslog group
      logConfiguration = {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "${aws_cloudwatch_log_group.ecs_monitoring.name}",
        "awslogs-region": "ca-central-1",
        "awslogs-stream-prefix": "streaming"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "main" {
  name                              = "bcer-${var.target_env}-service"
  cluster                           = aws_ecs_cluster.bcer_cluster.arn
  # Cant do count.index (research)
  task_definition                   = aws_ecs_task_definition.bcer_td.arn
  desired_count                     = 2
  #Health Check need to go up?
  health_check_grace_period_seconds = 60
  wait_for_steady_state             = false

  network_configuration {
    security_groups  = [data.aws_security_group.app.id]
#NEED TO FIGURE OUT aws_subnets
    subnets          = data.aws_subnets.app.ids
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.app.id
    container_name   = "bcer-${var.target_env}-definition"
    container_port   = var.app_port
  }

  depends_on = [data.aws_alb_listener.front_end, aws_iam_role_policy_attachment.ecs_task_execution_role]
  
   lifecycle {
  ignore_changes = [ capacity_provider_strategy ]
  }
#   tags = local.common_tags
}