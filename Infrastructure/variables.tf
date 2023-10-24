variable "target_env" {
  description = "AWS workload account env (e.g. dev, test, prod, sandbox, unclass)"
}

variable "aws_region" {
  description = "The AWS region things are created in"
  default     = "ca-central-1"
}

variable "ecs_task_execution_role_name" {
  description = "ECS task execution role name"
  default     = "BCER_EcsTaskExecutionRole"
}

variable "fargate_cpu" {
  description = "Fargate instance CPU units to provision (1 vCPU = 1024 CPU units)"
  default     = 512
}

variable "fargate_memory" {
  description = "Fargate instance memory to provision (in MiB)"
  default     = 1024
}

variable "bcer_cluster_name" {
  description = "Name for the FAM database cluster -- must be unique"
  default     = "bcer-cluster"
  type        = string
}

variable "common_tags" {
  description = "Common tags for created resources"
  default = {
    Application = "bcer"
  }
}

variable "health_check_path" {
  default = "/"
}

variable "alb_name" {
  description = "Name of the internal alb"
  default     = "default"
  type        = string
}

variable "acl_value" {
  default = "private"
}

variable "app_port" {
  description = "Port exposed by the docker image to redirect traffic to"
  default     = 8080
}

variable "app_image" {
  description = "Docker image to run in the ECS cluster. _Note_: there is a blank default value, which will cause service and task resource creation to be supressed unless an image is specified."
  default     = ""
  type        = string
}

variable "app_count" {
  description = "Number of docker containers to run"
  default     = 2
}

variable "fam_console_idp_name" {
  description = "Identifies which version of IDIR to use (DEV, TEST, or PROD)"
  type        = string
}

variable "application" {
  description = "Application that is being deployed"
}

variable "db_instance_identifier" {
  description = "Identifies the cluster ID of aurora_rds_v2"
  default     = "bcer-cluster"
}

variable "timezone" {
  description = "Default timezone to use for containers + database"
  default     = "America/Vancouver"
  type        = string
}

variable "timestamp" {
  description = "Used to trigger ECS to redeploy builds when no task changes are present"
  type        = string
}
