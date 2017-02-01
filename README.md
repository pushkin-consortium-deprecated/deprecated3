![Pushkin Logo](images/logo.png)

Pushkin is a scalable ecosystem for psychological surveys and tests.

It consists of 5 key parts

## Puskin Client
![](images/client.png)

System of react/redux components allowing a user to easily create beautiful modern client friendly surveys using jspsych

## Pushkin API

Api server to handle data from clients

![](images/api.png)


## Pushkin DB

![](images/db.png)

DB worker to handle db writes/read logic and schemas

## Pushkin Worker

![](images/worker.png)
Python worker for data analysis

## Pushkin Cron

![](images/cron.png)

System for creating regular scheduled cron jobs for upkeep/management

## Why Pushkin

## Assumptions
1. You are somewhat familiar with isntalling programs and understand what your terminal is and how to use it.
2. You have access to a text editor like sublime/notepad++/etc.
3. [Docker](http://docker.com) is installed on your machine


## Getting started

### Development Mode
1. docker-compose up -f docker-compose.debug.yml

## Directory Structure

## Common Tasks

### Cronjobs

Pushkin makes adding a cron job easy, 
1. just add the file script you want ran in games-with-words-cron/scripts.
2. Add a line calling that file in games-with-words-cron/crontab

Each one of those files has access to the environment variables created in the docker file.

DB Connection is available as `DATABASE_URL` and the message queue as `AMPQ_ADDRESS`.

Right now we only support python and node.js cron tabs. feel free to modify the `Dockerfile` to add a different environment you may need.


## Roles and Permissions

## Acknowledgements

Josh DeLieuw of jspsych
