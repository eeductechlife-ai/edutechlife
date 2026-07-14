export function getVariant(testName) {
  const variants = this.abTests.variants[testName];
  if (!variants || variants.length === 0) {
    return null;
  }

  const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
  let random = Math.random() * totalWeight;

  for (const variant of variants) {
    if (random < variant.weight) {
      return variant;
    }
    random -= variant.weight;
  }

  return variants[0];
}

export function recordTestAttempt(testName, variantId, success = false) {
  const variants = this.abTests.variants[testName];
  if (!variants) return;

  const variant = variants.find((v) => v.id === variantId);
  if (variant) {
    variant.stats.attempts = (variant.stats.attempts || 0) + 1;
    if (success) {
      variant.stats.successes = (variant.stats.successes || 0) + 1;
    }

    if (variant.stats.attempts > 0) {
      variant.stats.rate =
        (variant.stats.successes / variant.stats.attempts) * 100;
    }

    this.abTests.testHistory.unshift({
      testName,
      variantId,
      success,
      timestamp: new Date().toISOString(),
    });

    if (this.abTests.testHistory.length > 500) {
      this.abTests.testHistory = this.abTests.testHistory.slice(0, 500);
    }

    this.saveABTests();
  }
}

export function optimizeTestWeights(testName) {
  const variants = this.abTests.variants[testName];
  if (!variants || variants.length < 2) return;

  const totalRate = variants.reduce((sum, v) => sum + (v.stats.rate || 0), 0);

  if (totalRate > 0) {
    variants.forEach((variant) => {
      variant.weight = (variant.stats.rate || 0) / totalRate;

      if (variant.weight < 0.1) {
        variant.weight = 0.1;
      }
    });

    const newTotalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
    variants.forEach((variant) => {
      variant.weight = variant.weight / newTotalWeight;
    });

    this.saveABTests();
  }
}

export function getABTestResults() {
  const results = [];

  Object.entries(this.abTests.variants).forEach(([testName, variants]) => {
    const test = this.abTests.tests[testName];
    if (!test) return;

    const variantResults = variants.map((variant) => ({
      name: variant.id,
      conversionRate: variant.stats.rate || 0,
      samples: variant.stats.attempts || 0,
      successes: variant.stats.successes || 0,
    }));

    const validVariants = variantResults.filter((v) => v.samples >= 10);
    let winner = null;

    if (validVariants.length >= 2) {
      validVariants.sort((a, b) => b.conversionRate - a.conversionRate);
      if (
        validVariants[0].conversionRate >
        validVariants[1].conversionRate * 1.1
      ) {
        winner = validVariants[0].name;
      }
    }

    results.push({
      name: testName,
      description: test.description,
      variants: variantResults,
      winner,
      totalSamples: variantResults.reduce((sum, v) => sum + v.samples, 0),
    });
  });

  return results;
}
