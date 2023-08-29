# data "aws_ami" "ec2" {
#   most_recent = true

#   filter {
#     name   = "name"
#     values = ["amzn2-ami-kernel-5.10-hvm*"]
#   }

#   filter {
#     name   = "virtualization-type"
#     values = ["hvm"]
#   }

#   owners = ["137112412989"]
# }

# resource "aws_instance" "db_access_ec2" {
#   ami           = data.aws_ami.ec2.id
#   instance_type = "t2.micro"
#   iam_instance_profile = "EC2-Default-SSM-AD-Role-ip"
#   #subject to change
#   security_groups = [data.aws_security_group.data.id]
#   #look into making this dynamic
#   subnet_id = data.aws_subnets.data.ids[0]
#   user_data = <<EOF
#   #!/bin/bash
#   yum install -y postgresql
#   EOF
# }