import * as inception from './inception';
import * as mqtt from './mqtt';
import * as inceptionHandler from './inceptionHandler';

let mqttConfig;

const startControlAreas = async () => {
  const controlAreas = await inception.getControlAreas();
  controlAreas.map(area => {
    const name = area.Name;
    const areaId = area.ID;
    const topic = `${mqttConfig.discovery_prefix}/alarm_control_panel/${areaId}/config`;
    const commandTopic = `inception/alarm_control_panel/${areaId}/set`;
    const message = {
      name,
      state_topic: `inception/alarm_control_panel/${areaId}`,
      command_topic: commandTopic,
      availability_topic: mqttConfig.availability_topic,
      code: mqttConfig.alarm_code,
      code_arm_required: false,
      payload_arm_away: 'Arm',
      payload_arm_home: 'ArmStay',
      payload_arm_night: 'ArmSleep',
      payload_disarm: 'Disarm'
    };
    mqtt.publish(topic, JSON.stringify(message));
    mqtt.subscribe(commandTopic);

    const areaHandler = inceptionHandler.handler(commandTopic, async (payload: string) => {
      await inception.postControlAreaActivity(areaId, payload);
    });
    mqtt.onMessage(areaHandler);
  });
}

const startControlDoors = async () => {
  const controlDoors = await inception.getControlDoors();
  controlDoors.map(door => {
    const name = door.Name;
    const doorId = door.ID;
    const topic = `${mqttConfig.discovery_prefix}/lock/${doorId}/config`;
    const commandTopic = `inception/lock/${doorId}/set`;
    const message = {
      name,
      state_topic: `inception/lock/${doorId}`,
      command_topic: commandTopic,
      availability_topic: mqttConfig.availability_topic,
      optimistic: false,
      payload_lock: 'Lock',
      payload_unlock: 'Unlock'
    }
    mqtt.publish(topic, JSON.stringify(message));
    mqtt.subscribe(commandTopic);

    const doorHandler = inceptionHandler.handler(commandTopic, async (payload: string) => {
      await inception.postControlDoorActivity(doorId, payload);
    });
    mqtt.onMessage(doorHandler);
  });
}

const startControlOutputs = async () => {
  const controlOutputs = await inception.getControlOutputs();
  controlOutputs.map(output => {
    const name = output.Name;
    const outputId = output.ID;
    const topic = `${mqttConfig.discovery_prefix}/switch/${outputId}/config`;
    const commandTopic = `inception/switch/${outputId}/set`;

    let icon = 'mdi:help-circle';

    if (name.toLowerCase().includes('screamer') || name.toLowerCase().includes('siren')) {
      icon = 'mdi:bullhorn-outline';
    } else if (name.toLowerCase().includes('door')) {
      icon = 'mdi:door-closed-lock';
    } else if (name.toLowerCase().includes('garage')) {
      icon = 'mdi:door-garage';
    } else if (name.toLowerCase().includes('gate')) {
      icon = 'mdi:door-gate';
    }

    const message = {
      name,
      state_topic: `inception/switch/${outputId}`,
      command_topic: commandTopic,
      availability_topic: mqttConfig.availability_topic,
      optimistic: false,
      payload_off: 'Off',
      payload_on: 'On',
      icon
    }
    mqtt.publish(topic, JSON.stringify(message));
    mqtt.subscribe(commandTopic);

    const outputHandler = inceptionHandler.handler(commandTopic, async (payload: string) => {
      await inception.postControlOutputActivity(outputId, payload);
    });
    mqtt.onMessage(outputHandler);
  });
}

const startControlInputs = async () => {
  const controlInputs = await inception.getControlInputs();
  controlInputs.map(input => {
    const name = input.Name;
    const outputId = input.ID;
    const topic = `${mqttConfig.discovery_prefix}/binary_sensor/${outputId}/config`;
    const commandTopic = `inception/binary_sensor/${outputId}/set`;

    let deviceClass = [
      'door',
      'motion',
      'opening',
      'power',
      'smoke',
      'vibration',
      'window',
      'cold',
      'heat',
      'light',
      'moisture'
    ].find(device => name.toLowerCase().includes(device)) || 'None';

    if (name.toLowerCase().includes('garage')) {
      deviceClass = 'garage_door';
    } else if (name.toLowerCase().includes('rex')) {
      deviceClass = 'door';
    }

    const message = {
      name,
      state_topic: `inception/binary_sensor/${outputId}`,
      command_topic: commandTopic,
      availability_topic: mqttConfig.availability_topic,
      device_class: deviceClass
    }
    mqtt.publish(topic, JSON.stringify(message));

    // Does not listen to command_topic
  });
};

export const connect = async (config: any) => {
  mqttConfig = config;

  await Promise.all([
    startControlAreas(),
    startControlDoors(),
    startControlOutputs(),
    startControlInputs()
  ]);
}