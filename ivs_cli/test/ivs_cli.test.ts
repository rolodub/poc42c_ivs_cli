import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as IvsCli from '../lib/ivs_cli-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new IvsCli.IvsCliStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
