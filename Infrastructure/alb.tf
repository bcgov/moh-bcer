# alb.tf

# Use the default ALB that is pre-provisioned as part of the account creation
# This ALB has all traffic on *.LICENSE-PLATE-ENV.nimbus.cloud.gob.bc.ca routed to it
data "aws_alb" "main" {
  name = var.alb_name
}

# Redirect all traffic from the ALB to the target group
data "aws_alb_listener" "front_end" {
  load_balancer_arn = data.aws_alb.main.id
  port              = 443
}

resource "aws_alb_target_group" "app" {
  name                 = "${var.application}-${var.target_env}-target-group"
  port                 = var.app_port
  protocol             = "HTTP"
  vpc_id               = data.aws_vpc.main.id
  target_type          = "ip"
  deregistration_delay = 30
  lifecycle {
    ignore_changes = [name]
  }
  stickiness {
    type = "lb_cookie"
    
  }

  health_check {
    healthy_threshold   = "5"
    interval            = "30"
    protocol            = "HTTP"
    matcher             = "200"
    timeout             = "5"
    path                = var.health_check_path
    unhealthy_threshold = "2"
  }

    tags = local.common_tags
}

resource "aws_lb_listener_rule" "host_based_weighted_routing" {
  listener_arn = data.aws_alb_listener.front_end.arn
  lifecycle {
    create_before_destroy = true
  }
  action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.app.arn
  }
  #figure out what to place here
  condition {
    path_pattern {
      values = ["/*"]
    }
  }
}