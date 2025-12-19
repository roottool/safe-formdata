# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**safe-formdata** is a boundary-focused FormData parser that establishes a strict, security-oriented boundary between untrusted FormData input and application logic.

## Critical: Follow AGENTS.md

**All implementation and review decisions must strictly adhere to AGENTS.md**, which defines the non-negotiable rules for this project:

- Core design rules (opaque keys, no silent behavior, no inference, explicit issue reporting)
- Security rules (prototype safety, prototype-free data containers)
- API contract (minimal public API, fixed IssueCode values)
- Non-goals (hard exclusions)
- Review criteria

When in doubt, consult AGENTS.md. If a change makes the parser smarter, more convenient, or more opinionated, it likely violates the boundary and should be rejected.

## Development Commands

This project is in early stages. Development commands will be added here once the implementation begins.

Expected setup:
- TypeScript-based implementation
- Minimal dependencies
- Single-file API

## Architecture Notes

Implementation has not yet begun. Architecture guidance will be added here as the codebase develops.
