FROM agentejo/cockpit:0.10.1

# Copy in custom configuration
COPY config.php /var/www/html/config/config.php

# Install dependencies for addons
RUN apt-get install git -y

# Download & install group management addon
RUN git clone https://github.com/serjoscha87/cockpit_GROUPS /tmp/cockpit_GROUPS && mv /tmp/cockpit_GROUPS/Groups /var/www/html/addons && rm -rf /tmp/cockpit_GROUPS

# Download & install editor formatting addon
RUN git clone https://github.com/pauloamgomes/CockpitCms-EditorFormats /var/www/html/addons/EditorFormats

# Download & install full-text search
RUN git clone https://github.com/agentejo/Detektivo /var/www/html/addons/Detektivo

# Download & install GraphQL endpoint
RUN git clone https://github.com/agentejo/CockpitQL /var/www/html/addons/CockpitQL
