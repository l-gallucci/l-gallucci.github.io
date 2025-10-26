---
layout: default
title: "About"
permalink: /about/
---

<link rel="stylesheet" href="{{ '/assets/css/about.css' | relative_url }}">

<div class="about-page">
  <canvas id="ventScene"></canvas>

  <div class="about-content">
    <h1>About Me</h1>
    <p>
      I’m a microbial ecologist exploring hydrothermal vents — both in the ocean and in data.
      Here, I study how information behaves like plumes: rising, mixing, and transforming.
    </p>
    <p>
      My work combines <strong>metagenomics</strong>, <strong>biogeochemistry</strong>,
      and <strong>modeling</strong> to uncover how microbes and elements interact in dynamic systems.
    </p>
  </div>
</div>

<div id="vent-scene">
  <canvas id="mountainCanvas"></canvas>
  <canvas id="plumeCanvas"></canvas>
</div>

<script src="{{ '/assets/js/ventScene.js' | relative_url }}"></script>