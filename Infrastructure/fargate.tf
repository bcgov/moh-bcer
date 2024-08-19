resource "aws_ecs_cluster" "bcer_cluster" {
  name = "${var.application}_cluster"
}

resource "aws_ecs_cluster_capacity_providers" "bcer_cluster" {
  cluster_name       = aws_ecs_cluster.bcer_cluster.name
  capacity_providers = ["FARGATE"]

  default_capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight            = 100

  }
}

resource "aws_ecs_task_definition" "bcer_td" {
  family                   = "${var.application}-${var.target_env}-task"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_execution_role.arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.fargate_cpu
  memory                   = var.fargate_memory
  tags                     = local.common_tags
  container_definitions = jsonencode([
    {
      essential = true
      name      = "${var.application}-${var.target_env}-definition"
      #change to variable to env. for GH Actions
      image       = "${data.aws_caller_identity.current.account_id}.dkr.ecr.ca-central-1.amazonaws.com/bcer-api:latest"
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
        { name = "DB_USERNAME",
        valueFrom = "${aws_secretsmanager_secret_version.rds_credentials.arn}:username::" },
        { name = "DB_PASSWORD"
        valueFrom = "${aws_secretsmanager_secret_version.rds_credentials.arn}:password::" },
        { name = "DB_HOST"
        valueFrom = "${aws_secretsmanager_secret_version.rds_credentials.arn}:host::" },
        { name = "DB_PORT"
        valueFrom = "${aws_secretsmanager_secret_version.rds_credentials.arn}:port::" },
        { name = "APPLICATION_PORT"
        valueFrom = aws_secretsmanager_secret_version.bcer_application_port.arn },
        { name = "AWS_ENV"
        valueFrom = aws_secretsmanager_secret_version.bcer_aws_env.arn },
        { name = "BC_DIRECTION_API_KEY"
        valueFrom = aws_secretsmanager_secret_version.bcer_bc_direction_api_key.arn },
        { name = "CLOSE_LOCATION_CRON_TIME"
        valueFrom = aws_secretsmanager_secret_version.bcer_close_location_cron_time.arn },
        { name = "CRON_JOB_NAMES"
        valueFrom = aws_secretsmanager_secret_version.bcer_cron_job_names.arn },
        { name = "DB_DATABASE"
        valueFrom = aws_secretsmanager_secret_version.bcer_db_database.arn },
        { name = "DB_SCHEMA"
        valueFrom = aws_secretsmanager_secret_version.bcer_db_schema.arn },
        { name = "EMAIL_GENERIC_NOTIFICATION_TEMPLATE_ID"
        valueFrom = aws_secretsmanager_secret_version.bcer_email_generic_notification_template_id.arn },
        { name = "ENABLE_SUBSCRIPTION"
        valueFrom = aws_secretsmanager_secret_version.bcer_enable_subscription.arn },
        { name = "ENABLE_TEXT_MESSAGES"
        valueFrom = aws_secretsmanager_secret_version.bcer_enable_text_messages.arn },
        { name = "GA_KEY"
        valueFrom = aws_secretsmanager_secret_version.bcer_ga_key.arn },
        { name = "HEAPSNAPSHOT_ENABLED"
        valueFrom = aws_secretsmanager_secret_version.bcer_heapsnapshot_enabled.arn },
        { name = "KEYCLOAK_AUTH_URL"
        valueFrom = aws_secretsmanager_secret_version.bcer_keycloak_auth_url.arn },
        { name = "KEYCLOAK_CLIENT"
        valueFrom = aws_secretsmanager_secret_version.bcer_keycloak_client.arn },
        { name = "KEYCLOAK_DATA_AUTH_URL"
        valueFrom = aws_secretsmanager_secret_version.bcer_keycloak_data_auth_url.arn },
        { name = "KEYCLOAK_DATA_CLIENT"
        valueFrom = aws_secretsmanager_secret_version.bcer_keycloak_data_client.arn },
        { name = "KEYCLOAK_DATA_REALM"
        valueFrom = aws_secretsmanager_secret_version.bcer_keycloak_data_realm.arn },
        { name = "KEYCLOAK_PORT"
        valueFrom = aws_secretsmanager_secret_version.bcer_keycloak_port.arn },
        { name = "KEYCLOAK_REALM"
        valueFrom = aws_secretsmanager_secret_version.bcer_keycloak_realm.arn },
        { name = "LOAD_CERTS"
        valueFrom = aws_secretsmanager_secret_version.bcer_load_certs.arn },
        { name = "LOGS_PATH"
        valueFrom = aws_secretsmanager_secret_version.bcer_logs_path.arn },
        { name = "MAP_BOX_ACCESS_TOKEN"
        valueFrom = aws_secretsmanager_secret_version.bcer_map_box_access_token.arn },
        { name = "NOI_EXPIRY_DATE"
        valueFrom = aws_secretsmanager_secret_version.bcer_noi_expiry_date.arn },
        { name = "SALES_REPORT_END_DATE"
        valueFrom = aws_secretsmanager_secret_version.bcer_sales_report_end_date.arn },
        { name = "TEXT_API_KEY"
        valueFrom = aws_secretsmanager_secret_version.bcer_text_api_key.arn },
        { name = "TEXT_GENERIC_NOTIFICATION_TEMPLATE_ID"
        valueFrom = aws_secretsmanager_secret_version.bcer_text_generic_notification_template_id.arn },
        { name = "VAPING_NOTIFICATION_EMAIL"
        valueFrom = aws_secretsmanager_secret_version.bcer_vaping_notification_email.arn },
      ]
      environment = [
        { name = "TZ"
        value = var.timezone },
      ]
      #change awslog group
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-create-group  = "true"
          awslogs-group         = "/ecs/${var.application}"
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "main" {
  name                              = "${var.application}-${var.target_env}-service"
  cluster                           = aws_ecs_cluster.bcer_cluster.arn
  task_definition                   = aws_ecs_task_definition.bcer_td.arn
  desired_count                     = var.app_count
  health_check_grace_period_seconds = 30
  wait_for_steady_state             = false
  force_new_deployment              = true

  triggers = {
    redeployment = var.timestamp
  }

  network_configuration {
    security_groups  = [data.aws_security_group.app.id]
    subnets          = data.aws_subnets.app.ids
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.app.id
    container_name   = "${var.application}-${var.target_env}-definition"
    container_port   = var.app_port
  }

  depends_on = [data.aws_alb_listener.front_end, aws_iam_role_policy_attachment.ecs_task_execution_role]

  lifecycle {
    ignore_changes = [capacity_provider_strategy]
  }

}
