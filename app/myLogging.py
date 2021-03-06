"""Copyright 2018 Centrum Wiskunde & Informatica

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""
from __future__ import unicode_literals
from builtins import object
import logging
import datetime
import time
import sys

logging.basicConfig()

# Default logging configuration: INFO for document and timeline (useful to app developers), WARNING for everything else.
# DEFAULT_LOG_CONFIG="document:INFO,WARNING"
DEFAULT_LOG_CONFIG = "INFO"


class MyFormatter(logging.Formatter):
    def format(self, record):
        contextID = None
        documentID = None
        if hasattr(record, 'contextID'):
            contextID = record.contextID
        if hasattr(record, 'documentID'):
            documentID = record.documentID
        source = "AuthoringService"
        level = record.levelname
        subSource = record.name
        message = logging.Formatter.format(self, record)
        logmessage = repr('"' + message)
        if logmessage[0] == 'u':
            logmessage = logmessage[1:]
        logmessage = "'" + logmessage[2:]

        rvList = ['2-Immerse']
        if source:
            rvList.append('source:%s' % source)
        if subSource:
            rvList.append('subSource:%s' % subSource)
        if level:
            rvList.append('level:%s' % level)
        if contextID:
            rvList.append('contextID:%s' % contextID)
        if documentID:
            rvList.append('documentID:%s' % documentID)
        if hasattr(record, 'xpath'):
            rvList.append('xpath:%s ' % repr(record.xpath))
        if hasattr(record, 'dmappcID'):
            rvList.append('dmappcID:%s ' % record.dmappcID)
        rvList.append('sourcetime:%s' % datetime.datetime.fromtimestamp(time.time()).isoformat())
        rvList.append('logmessage:%s' % logmessage)
        return ' '.join(rvList)


class MyLoggerAdapter(logging.LoggerAdapter):
    def process(self, msg, kwargs):
        if 'extra' in kwargs:
            kwargs['extra'].update(self.extra)
        else:
            kwargs['extra'] = self.extra

        return msg, kwargs


# Send stdout and stderr to the logger as well.
class StreamToLogger(object):
    def __init__(self, logger, log_level=logging.INFO):
        self.logger = logger
        self.log_level = log_level
        self.linebuf = ''

    def write(self, buf):
        for line in buf.rstrip().splitlines():
            self.logger.log(self.log_level, line.rstrip())
         
    def flush(self):
        pass

_keep_stdout = sys.stdout
_keep_stderr = sys.stderr

def install(noKibana=False, logLevel=DEFAULT_LOG_CONFIG):
    if noKibana:
        currentFormatterClass = logging.Formatter
        sys.stdout = _keep_stdout
        sys.stderr = _keep_stderr
    else:
        currentFormatterClass = MyFormatter
        sys.stdout = StreamToLogger(logging.getLogger('stdout'), logging.INFO)
        sys.stderr = StreamToLogger(logging.getLogger('stderr'), logging.INFO)
    if logLevel:
        for ll in logLevel.split(','):
            if ':' in ll:
                loggerToModify = logging.getLogger(ll.split(':')[0])
                newLevel = getattr(logging, ll.split(':')[1])
            else:
                loggerToModify = logging.getLogger()
                newLevel = getattr(logging, ll)
            loggerToModify.setLevel(newLevel)

    rootLogger = logging.getLogger()
    rootLogger.handlers[0].setFormatter(currentFormatterClass())

