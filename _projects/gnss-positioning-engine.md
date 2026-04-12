---
title: "Multi-Constellation Dual-band GNSS Positioning Engine"
slug: "gnss-positioning-engine"
description: "Software-defined GNSS engine from RTCM3 MSM observations with multi-constellation WLS, atmospheric corrections, and Hatch smoothing."
date: 2026-04-12
status: "Complete"
lang: "Python"
icon: "🛰️"
repo_url: "https://github.com/adedolapoadegboye/gnss-positioning-engine"
license: "MIT"
tags:
  - "GNSS"
  - "RTCM3"
  - "Positioning"
  - "Weighted Least Squares"
  - "Python"
  - "Galileo"
  - "GPS"
  - "GLONASS"
  - "BeiDou"
---

# Project Summary
GNSS Positioning Engine is a software-defined GNSS positioning system that computes receiver position directly from raw RTCM3 measurements, without relying on receiver-generated NMEA fixes for the solution pipeline. It supports GPS, Galileo, and BeiDou in active SPS positioning, with GLONASS tracking currently decoded and stored but excluded from WLS pending frame transformation support.

# Problem It Solves
Most GNSS workflows depend on black-box receiver position outputs. This project exposes the full navigation pipeline end-to-end so engineers can inspect, validate, and extend each processing stage: frame extraction, observation decoding, satellite state propagation, atmospheric correction, and weighted position solving.

# Current Completion Status
- SPS (Standard Positioning Service): Implemented and operational
- DGNSS: Planned
- RTK: Planned

# Technical Scope
- Input transport: serial RTCM3 stream from GNSS receiver
- Observation support: MSM4 and MSM7
- Ephemeris support: GPS (1019), GLONASS (1020), BeiDou (1042), Galileo (1045/1046)
- Active WLS constellations: GPS + Galileo + BeiDou
- GLONASS status: decoded/tracked, excluded from WLS until PZ-90.11 to WGS-84 Helmert transform is added

# Implemented Algorithms and Models
- Keplerian satellite orbit computation (GPS/Galileo/BeiDou)
- GLONASS RK4 orbit integration (tracked path)
- Relativistic satellite clock correction
- Earth rotation (Sagnac) correction
- Saastamoinen tropospheric model + Niell mapping function
- Klobuchar ionospheric model (single-frequency fallback)
- Dual-frequency ionosphere-free combination where available
- Hatch carrier smoothing (100-epoch window)
- Multi-constellation weighted least squares with per-constellation clock offsets
- Residual-based outlier rejection and earth-surface validity guard

# Performance Snapshot
- Accuracy reported in README: ~5 m 2D versus receiver NMEA reference under GPS + Galileo + BeiDou
- Warmed Hatch filter behavior: ~2 to 3 m 2D in favorable geometry conditions
- First fix timing: typically 30 to 60 seconds after connect (environment dependent)

# Architecture Notes
- Threaded serial handlers ingest rover/base streams
- RTCM3 frame extractor validates CRC24Q
- Message router dispatches MSM and ephemeris payloads
- Epoch accumulator merges constellation observations on GPS TOW boundaries
- Positioning engine outputs live SPS solution to a PyQt interface with quality panels and plots

# Repository Structure Highlights
- `main.py`: entry point
- `gnss_positioning/core/`: pipeline orchestration, constants, data models, serial handling
- `gnss_positioning/parsers/`: RTCM3 frame/MSM/ephemeris parsing and NMEA parsing
- `gnss_positioning/engines/`: SPS engine (implemented), DGNSS/RTK stubs
- `gnss_positioning/corrections/`: atmosphere models and ionosphere-free handling
- `gnss_positioning/ui/`: PyQt application interface

# Planned Next Milestones
- Add PZ-90.11 to WGS-84 Helmert transform and enable GLONASS in WLS
- Implement DGNSS correction flow
- Implement RTK float/fixed solution with ambiguity resolution
- Add advanced cycle-slip detection and RINEX logging
- Add NTRIP client support

# Source Links
- GitHub repository: https://github.com/adedolapoadegboye/gnss-positioning-engine
- Primary documentation: README.md in the repository

