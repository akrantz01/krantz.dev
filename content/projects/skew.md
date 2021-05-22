+++
title = "Skew"
date = "2020-10-08"
tags = ['python', 'js']
+++

Skew is a chrome extension that lets people see the “skew”, or political bias using a sliding scale.

After navigating to an article, users can click on the Skew chrome extension. Skew then parses the article and uses Google Cloud’s Natural Language Processing API to find biased wording.
It categorizes those words as either “right”, “left”, or “neutral” then shows the extent either “minimal”, “moderate”, “strong”, or “extreme”.
The analysis is displayed to the user within the extension window by showing a point on a line where the side denotes left or right, and the distance from the end denotes the extent of the bias.

Skew was built for [IvyHacks 2020](https://ivyhacks.com).
Due to the time constraints placed upon us and access to limited data, the detection is not particularly accurate, but it can still get the general sense of the article.  

{{< project GitHub="https://github.com/akrantz01/skew" >}}
