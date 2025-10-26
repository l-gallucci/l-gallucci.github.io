---
layout: default
title: "Home"
permalink: /
---

<canvas id="dnaCanvas"></canvas>

<div class="terminal-page">

  <!-- Profile Section -->
  <div class="profile-section">
    <img src="{{ '/assets/img/profile.jpg' | relative_url }}" alt="Luigi Gallucci" class="profile-photo">
    <h1 class="profile-name">Luigi Gallucci</h1>
  </div>

  <!-- Terminal -->
  <div class="terminal-container">
    <div class="terminal-header">
      <div class="dot red"></div>
      <div class="dot yellow"></div>
      <div class="dot green"></div>

      <!-- Tabs -->
      <div class="terminal-tabs">
        <span class="tab active" data-text="Hi everyone, I'm Luigi — a microbial ecologist! I alternate between oceanographic expeditions and a desk and a computer. ">Microbial Ecologist</span>
        <span class="tab" data-text="Coding helps me express creativity — I love building tools, games, and interactive experiences.">Coding for fun</span>
        <span class="tab" data-text="Cooking keeps me balanced — it’s where patience meets chemistry and creativity.">Cooking for passion</span>
      </div>
    </div>

    <div class="terminal-body">
      <p class="terminal-line typing" id="typed-text"></p>
    </div>
  </div>

</div>

<!-- Scripts -->
<script src="{{ '/assets/js/typing.js' | relative_url }}"></script>
<script src="{{ '/assets/js/dna_bg.js' | relative_url }}"></script>