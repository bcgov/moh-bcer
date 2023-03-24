resource "aws_sns_topic" "alerts" {
  name = "cloudwatch_alarms"
}

##########################################
######## CloudWatch Alarm for ECS ########
##########################################

resource "aws_cloudwatch_metric_alarm" "ecs_cpu_utilization_alarm" {
  alarm_name          = "ecs-cpu-utilization-alarm"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric checks the CPU utilization of the ECS service"
  tags                = local.common_tags

  
  dimensions = {
    ClusterName = var.cluster_name
    ServiceName = var.ecs_service_name
  }

  alarm_actions = [
    aws_sns_topic.alerts.arn
  ]
}


resource "aws_cloudwatch_metric_alarm" "ecs_memory_utilization" {
  alarm_name          = "ecs-memory-utilization-alarm"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "2"
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "Alarm for ECS memory utilization exceeding 80%"
  tags                = local.common_tags

  
 dimensions = {
    ClusterName = var.cluster_name
    ServiceName = var.ecs_service_name
  }

  alarm_actions = [
    aws_sns_topic.alerts.arn
  ]
}


resource "aws_cloudwatch_metric_alarm" "ecs_service_status" {
  alarm_name          = "ecs-service-status"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "ServiceState"
  namespace           = "AWS/ECS"
  period              = "60"
  statistic           = "Minimum"
  threshold           = "1"
  tags                = local.common_tags

  
 dimensions = {
    ClusterName = var.cluster_name
    ServiceName = var.ecs_service_name
  }
  
  alarm_description = "Alarm for Amazon ECS service status"
  
  alarm_actions = [
    aws_sns_topic.alerts.arn
  ]
}


resource "aws_cloudwatch_metric_alarm" "ecs_network_traffic" {
  alarm_name          = "ecs-network-traffic"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "NetworkIn"
  namespace           = "AWS/ECS"
  period              = "60"
  statistic           = "Sum"
  threshold           = "100000"
  tags                = local.common_tags

  
 dimensions = {
    ClusterName = var.cluster_name
    ServiceName = var.ecs_service_name
  }
  
  alarm_description = "Alarm for Amazon ECS Network Traffic"
  
  alarm_actions = [
    aws_sns_topic.alerts.arn
  ]
}


resource "aws_cloudwatch_metric_alarm" "ecs_disk_usage" {
  alarm_name          = "ecs-disk-usage"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "TaskFilesystemUtilization"
  namespace           = "AWS/ECS"
  period              = "60"
  statistic           = "Average"
  threshold           = "80"
  tags                = local.common_tags

  
 dimensions = {
    ClusterName = var.cluster_name
    ServiceName = var.ecs_service_name
  }
  
  alarm_description = "Alarm for Amazon ECS task filesystem utilization"
  
  alarm_actions = [
    aws_sns_topic.alerts.arn
  ]
}

resource "aws_cloudwatch_metric_alarm" "ecs_task_failures" {
  alarm_name          = "ecs-task-failures"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "TaskFailures"
  namespace           = "AWS/ECS"
  period              = "60"
  statistic           = "Sum"
  threshold           = "1"
  tags                = local.common_tags

  
  dimensions = {
    ClusterName = var.cluster_name
  }
  
  alarm_description = "Alarm for Amazon ECS task failures"
  
  alarm_actions = [
    aws_sns_topic.alerts.arn
  ]
}


##########################################
###### CloudWatch Alarm for Aurora #######
##########################################


resource "aws_cloudwatch_metric_alarm" "aurora_cpu_alarm" {
  alarm_name          = "aurora-cpu-utilization"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "3"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = "60"
  statistic           = "Average"
  threshold           = "70"
  alarm_description   = "Alarm when Aurora CPU utilization exceeds 70%"

  alarm_actions = [
    aws_sns_topic.alerts.arn
  ]


  dimensions = {
    DBInstanceIdentifier = "${var.db_instance_identifier}-${var.target_env}" 
  }
}


resource "aws_cloudwatch_metric_alarm" "db_connections_alarm" {
  alarm_name          = "aurora-db-connections-alarm"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 2
  metric_name         = "DatabaseConnections"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 100
  alarm_description   = "Alarm when the number of database connections exceeds 100 for 2 consecutive periods"
  
  alarm_actions = [
    aws_sns_topic.alerts.arn
  ]

  dimensions = {
    DBInstanceIdentifier = "${var.db_instance_identifier}-${var.target_env}" 
  }
}


resource "aws_cloudwatch_metric_alarm" "disk_queue_depth_alarm" {
  alarm_name          = "aurora-disk-queue-depth-alarm"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "DiskQueueDepth"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Maximum"
  threshold           = 10
  alarm_description   = "Alarm when the disk queue depth (IOPS requests waiting to be serviced) exceeds 10 for 2 consecutive periods"
  alarm_actions = [
    aws_sns_topic.alerts.arn
  ]

  dimensions = {
    DBInstanceIdentifier = "${var.db_instance_identifier}-${var.target_env}" 
  }
}


##########################################
###### CloudWatch Alarm for Billing #######
##########################################

resource "aws_cloudwatch_metric_alarm" "billing_alarm" {
  alarm_name          = "Billing Alert"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = "EstimatedCharges"
  namespace           = "AWS/Billing"
  period              = "86400" # 1 day (in seconds)
  statistic           = "Maximum"
  threshold           = "375"   
  
  alarm_description = "This alarm will be triggered if the estimated charges for the account exceed $3000 CAD within a 1-month period."
  
  alarm_actions = [
    aws_sns_topic.alerts.arn
  ]
}
