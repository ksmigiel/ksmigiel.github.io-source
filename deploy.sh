#!/bin/bash
hugo --baseUrl="http://ksmigiel.com" --destination="deploy"
find deploy/ -name '*.html' -exec sed '/^\s*$/d' {} -i \;