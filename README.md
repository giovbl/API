# SampleManager
SampleManager is a WebApp developed during an university work internship at Kelyon Srl.

The WebApp enables the management of biological samples movements between medical facilities, including the ability to register and share data related to biological samples, patients, and medical reports.

# Installation

SampleManager can be installed using Docker

```
docker image build -t webapp
docker run --name WebApp -d -p 80:3000 webapp
```
