import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3Deployment from '@aws-cdk/aws-s3-deployment'

export class IvsCliStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const ivsClientSiteBucket = new s3.Bucket(this, "my-static-website-bucket", {
      publicReadAccess: true,
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
  }
}
