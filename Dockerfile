# Fetching the minified node image on apline linux
FROM node:slim

# Declaring env
ENV NODE_ENV development

# Setting up the work directory
WORKDIR /pasir-be

# Copying all the files in our project
COPY . .
COPY startup.sh startup.sh
RUN chmod +x startup.sh

# Installing dependencies
RUN npm install -g
RUN npm install nodemon

# Starting our application
# ENTRYPOINT [ "./startup.sh" ]

# Exposing server port
EXPOSE 5020