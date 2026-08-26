# FutureScope — Career Future Explorer

Interactive Arabic RTL web application for exploring university faculties, departments and sub-specializations with 5-year and 10-year future indicators.

## Stack
- Java 21 backend (built-in `HttpServer`, no Maven required)
- HTML5
- CSS3 (glassmorphism + responsive + animations)
- Vanilla JavaScript

## Features
- Faculty → department → specialization hierarchy
- 5-year / 10-year future score
- Competition pressure, income-relative score, and future verdict
- Search across faculty, department and sub-specialization
- Filters: strong / stable / under pressure
- Compare up to 3 faculties
- Share/copy current URL
- Dark / light mode
- Animated radar hero and responsive cards
- Evidence links to WEF and PwC reports

## Important modeling note
The scores are analytical estimates for planning and comparison; they are not guarantees of employment or salary.
The catalog is intentionally broad across major academic families; it is not a legal registry of every faculty at every university in every country.

## Run
1. Install JDK 21+.
2. Run `run.bat` on Windows, or execute the Java class manually.
3. Open `http://localhost:8080`.

## Sources
- WEF Future of Jobs 2025: https://www.weforum.org/publications/the-future-of-jobs-report-2025/digest/
- PwC AI Jobs Barometer 2026: https://www.pwc.com/gx/en/news-room/press-releases/2026/pwc-2026-ai-jobs-barometer.html
