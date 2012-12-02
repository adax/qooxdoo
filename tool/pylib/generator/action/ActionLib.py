#!/usr/bin/env python
# -*- coding: utf-8 -*-

################################################################################
#
#  qooxdoo - the new era of web development
#
#  http://qooxdoo.org
#
#  Copyright:
#    2006-2012 1&1 Internet AG, Germany, http://www.1und1.de
#
#  License:
#    LGPL: http://www.gnu.org/licenses/lgpl.html
#    EPL: http://www.eclipse.org/org/documents/epl-v10.php
#    See the LICENSE file in the project's top-level directory for details.
#
#  Authors:
#    * Thomas Herchenroeder (thron7)
#
################################################################################

import re, os, sys, types, glob, time

from misc import filetool
from generator.runtime.ShellCmd import ShellCmd

##
# Library that contains various functions that implement Generator job actions
# (aka. 'triggers')
#

class ActionLib(object):
    def __init__(self, config, console_):
        self._config   = config
        self._console  = console_
        self._shellCmd = ShellCmd()

    def clean(self, cleanMap):
        assert isinstance(cleanMap, types.DictType)
        for item in cleanMap:
            self._console.info(item)
            for file in cleanMap[item]:
                file = self._config.absPath(file) 
                # resolve file globs
                for entry in glob.glob(file):
                    # safety first
                    if os.path.splitdrive(entry)[1] == os.sep:
                        raise RuntimeError, "!!! I'm not going to delete '/' recursively !!!"
                    self._shellCmd.rm_rf(entry)


    def watch(self, jobconf):
        since = time.time()
        interval = jobconf.get("watch/interval", 2)
        path = jobconf.get("watch/path", "")
        if not path:
            return
        exit_on_retcode = jobconf.get("watch/exit-on-retcode", True)
        command = jobconf.get("watch/command", "")
        if not command:
            return
        print "Press Ctrl-C (Ctrl-Z on Windows) to terminate."
        while True:
            time.sleep(interval)
            ylist = filetool.findYoungest(path,since=since)
            since = time.time()
            if ylist:
                try:
                    self.runShellCommand(command % ' '.join([f[0] for f in ylist]))
                except RuntimeError:
                    if exit_on_retcode:
                        raise
                    else:
                        pass
        return


    def runShellCommands(self, jobconf):
        if not jobconf.get("shell/command"):
            return

        shellcmd = jobconf.get("shell/command", "")
        if isinstance(shellcmd, list):
            for cmd in shellcmd:
                self.runShellCommand(cmd)
        else:
            self.runShellCommand(shellcmd)


    def runShellCommand(self, shellcmd):
        rc = 0
        self._shellCmd       = ShellCmd()

        self._console.info("Executing shell command \"%s\"..." % shellcmd)
        self._console.indent()

        rc = self._shellCmd.execute(shellcmd, self._config.getConfigDir())
        if rc != 0:
            raise RuntimeError, "Shell command returned error code: %s" % repr(rc)
        self._console.outdent()


