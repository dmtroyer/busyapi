# Work Log for Propeller Health

* Author: David Troyer, dmtroyer@gmail.com

## Log

* 2018-08-06 11:08 cloned the repo. diving in!
* 2018-08-06 11:10 install, noticed npm vulnerabilities, updated those.
* 2018-08-06 11:15 general overview of the application.
* 2018-08-06 11:20 researching node application profiling.
* 2018-08-06 11:44 Baseline ab results:
    Concurrency Level:      100
    Time taken for tests:   2.984 seconds
    Complete requests:      2000
    Failed requests:        0
    Total transferred:      434000 bytes
    Total body sent:        488000
    HTML transferred:       22000 bytes
    Requests per second:    670.27 [#/sec] (mean)
    Time per request:       149.194 [ms] (mean)
    Time per request:       1.492 [ms] (mean, across all concurrent requests)
    Transfer rate:          142.04 [Kbytes/sec] received
                            159.71 kb/s sent
                            301.75 kb/s total
* 2018-08-06 11:44 looks like we're getting a 670 requests per second baseline, we need 1000000/60 = 16,667
* 2018-08-06 11:45 Evaluating node profile for optimization opportunities in code.
* 2018-08-06 12:00 Ran node with --trace-sync-io to search for synchronous calls. seems to only be startup items that are running synchronously.
* 2018-08-06 12:10 Looking at different process managers and cluster
* 2018-08-06 12:18 Tried pm2, oddly I'm not getting any performance gains.
* 2018-08-06 12:27 Tried using node cluster, but not getting as much performance gain as expected. Trying express-cluster
* 2018-08-06 12:59 getting decent performance with express-cluster, ~8000 req/sec. This is not persisting the usage data, however:
    Concurrency Level:      100
    Time taken for tests:   12.348 seconds
    Complete requests:      100000
    Failed requests:        0
    Keep-Alive requests:    100000
    Total transferred:      22300000 bytes
    Total body sent:        26800000
    HTML transferred:       800000 bytes
    Requests per second:    8098.68 [#/sec] (mean)
    Time per request:       12.348 [ms] (mean)
    Time per request:       0.123 [ms] (mean, across all concurrent requests)
    Transfer rate:          1763.68 [Kbytes/sec] received
                            2119.58 kb/s sent
                            3883.25 kb/s total
* 2018-08-06 13:45 Tried using messaging between the workers and the master for usage persistance in memory, having trouble with the messaging rules.
* 2018-08-06 14:33 Better luck with redis for usage data persistance, about halfway there (8100 requests per second) on my little laptop.
    Concurrency Level:      100
    Time taken for tests:   61.705 seconds
    Complete requests:      500000
    Failed requests:        0
    Keep-Alive requests:    500000
    Total transferred:      114500000 bytes
    Total body sent:        134000000
    HTML transferred:       6500000 bytes
    Requests per second:    8103.12 [#/sec] (mean)
    Time per request:       12.341 [ms] (mean)
    Time per request:       0.123 [ms] (mean, across all concurrent requests)
    Transfer rate:          1812.12 [Kbytes/sec] received
                            2120.74 kb/s sent
                            3932.86 kb/s total

## Suggested changes to the physical architecture/hardware that may achieve the goal

* A server with more cores would be able to run more node instances in parallel using node clustering and would greatly increase the number of requests per second it could handle.
* A load balancer in front of multiple servers could further increase the number of node instances that could be run in parallel, but this would require changes to the data persistence strategy.

## Methods of measuring whether or not the goal has been achieved

* I used Apache Benchmark (ab) as a tool to give me an idea of how many requests per second the application could handle.
* Other tools such as Artillery or Apache JMeter could be utilized as well.
