#!/bin/bash

set -e

export CFLAGS="$CFLAGS -I./../../zstd/include -I./../../aws-sdk-cpp/include -DUSE_AWS"
export CXXFLAGS="$CXXFLAGS -I./../../zstd/include -I./../../aws-sdk-cpp/include -DUSE_AWS"
export PLATFORM_LDFLAGS="-laws-cpp-sdk-s3 -laws-cpp-sdk-kinesis -laws-cpp-sdk-core -laws-cpp-sdk-transfer"
export EXTRA_CFLAGS="-Wno-format -Wno-unused-variable"
export EXTRA_CXXFLAGS="-Wno-format -Wno-unused-variable"
export USE_RTTI=1

OS_NAME=$(uname)

if [ "$OS_NAME" = "Linux" ]; then
    export CFLAGS="$CFLAGS -fPIC"
    export CXXFLAGS="$CXXFLAGS -fPIC"
fi

mkdir -p lib
cd rocksdb-cloud

make -j4 static_lib

mv librocksdb.a ../lib/