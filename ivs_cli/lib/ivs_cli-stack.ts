import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3Deployment from '@aws-cdk/aws-s3-deployment'
import { CloudFrontWebDistribution,OriginAccessIdentity } from '@aws-cdk/aws-cloudfront'

export class IvsCliStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const ivsClientSiteBucket = new s3.Bucket(this, "my-static-website-bucket", {
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,        
      websiteIndexDocument: "index.html"
     });
     ivsClientSiteBucket.addToResourcePolicy(
      new iam.PolicyStatement({
      sid: 'UploadToWebsiteFromLambda',
      actions: [
      "s3:PutObject",
      "s3:Get*",
      "s3:DeleteObject"
    ],
      resources: [ivsClientSiteBucket.bucketArn,ivsClientSiteBucket.arnForObjects('*')],
      principals: [new iam.ServicePrincipal('lambda.amazonaws.com')],
    }));

      const deployment = new s3Deployment.BucketDeployment(this, "deployStaticWebsite", {
      sources: [s3Deployment.Source.asset("website")],
      destinationBucket: ivsClientSiteBucket
   });
   const oia = new OriginAccessIdentity(this, 'OIA', {
    comment: "Created by CDK"
  });
  ivsClientSiteBucket.grantRead(oia);

   const distribution = new CloudFrontWebDistribution(this, 'cdk-example-cfront', {
    originConfigs: [
      {
        s3OriginSource: {
          s3BucketSource: ivsClientSiteBucket,
          originAccessIdentity: oia
        },
        behaviors : [ {isDefaultBehavior: true}]
      }
    ]
  });
}
}