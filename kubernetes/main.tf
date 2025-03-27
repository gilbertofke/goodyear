module "vpc" {
  source     = "./modules/vpc"
  cidr_block = "10.0.0.0/16"
}

module "eks" {
  source          = "./modules/eks"
  cluster_name    = "goodyear-scraper"
  vpc_id          = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnets
}