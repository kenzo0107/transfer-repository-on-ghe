FROM ubuntu:17.04
RUN apt-get update -y&&\
  apt-get install -y libfreetype6-dev \
                     libfontconfig1-dev \
                     language-pack-ja \
                     wget \
                     bzip2 \
                     git \
                     python \
                     unifont

RUN mkdir /src
WORKDIR /src

# install phantomJS
RUN wget https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2&&\
 tar xvf phantomjs-2.1.1-linux-x86_64.tar.bz2&&\
 mv phantomjs-2.1.1-linux-x86_64/bin/phantomjs /usr/local/bin/

 # install casperJS
 RUN git clone git://github.com/n1k0/casperjs.git&&\
   mv casperjs /opt/&&\
   ln -sf /opt/casperjs/bin/casperjs /usr/local/bin/casperjs

 #make directory
 RUN mkdir /script
 WORKDIR /script

 ENTRYPOINT ["casperjs"]
 CMD ["--version"]
