---
authorlink: http://ksmigiel.com
authorname: Krzysztof Śmigiel
date: 2018-09-18T00:00:00+00:00
description: "How to get axis back in line."
excerpt: "This post starts new era on my blog. As you might already have noticed, I have decided to change language of new posts to English. Aim is to share my ideas and thoughts with more people and as side effect practice my foreign language writing skills."
slug: kendo-charts
title: "Kendo UI Charts renders category axis labels incorrectly for negative series."
tags: [webdev, kendo]
---

This post starts new era on my blog. As you might already have noticed, I have decided to change language of new posts to English. Aim is to share my ideas and thoughts with more people, and as side effect, practice my foreign language writing skills. Because I treat this as an experiment, it would be great to get some feedback from you. Also please spot in comments or directly by email any misspelling or grammatical error (and any other of course).

## Kendo Charts with negative values
Recently I was playing with [Kendo UI Charts][1]. Everything seemed perfect until real data was loaded from database. All examples in documentation show charts with positive values only! Kendo with default configuration has problem with rendering proper category axis placement with negative ones.

![wrong](/images/kendo-charts/wrong.jpg)

You can play with the code [here][2] by using Kendo UI Dojo - playground.

There is no official way to fix this. You can add some padding for labels, but then value of padding needs to be adjusted for every data change, which looks like enormous hack. While browsing web for solution I have come across some tip, that it can be done with two category axes.

## Solution with category axis
Finally I was able to place category axis on left side of the chart by hacking here and there. To fix you chart you need to follow these steps:

1. Create additional invisible category axis. It should be placed in configuration array as the first one.
2. Add to value axis configuration `axisCrossingValue` array. Values of this array are crossing points with each subsequent category axis. So we need to adjust the second value to cross at minimal value - because we want to place that axis on the left side.

Code definitely will remove any doubt:

``` js
categoryAxis: [{
    visible: false // (1)
}, {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    majorGridLines: {
        visible: false
    }
}]
valueAxis: {
    axisCrossingValue: [0, Number.NEGATIVE_INFINITY] // (2)
}
```

![good](/images/kendo-charts/good.jpg)

Please look at [full example][4] in dojo.

---

1. https://docs.telerik.com/kendo-ui/controls/charts/overview
2. https://dojo.telerik.com/uTuwOwOQ/2
3. https://docs.telerik.com/kendo-ui/api/javascript/dataviz/ui/chart
4. https://dojo.telerik.com/AYuPogoC/5

[1]: https://docs.telerik.com/kendo-ui/controls/charts/overview
[2]: https://dojo.telerik.com/uTuwOwOQ/2
[3]: https://docs.telerik.com/kendo-ui/api/javascript/dataviz/ui/chart
[4]: https://dojo.telerik.com/AYuPogoC/5



