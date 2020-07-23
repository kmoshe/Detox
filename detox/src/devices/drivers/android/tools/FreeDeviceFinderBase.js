const log = require('../../../../utils/logger').child({ __filename });

const DEVICE_LOOKUP_LOG_EVT = 'DEVICE_LOOKUP';

class FreeDeviceFinderBase {
  constructor(adb, deviceRegistry) {
    this.adb = adb;
    this.deviceRegistry = deviceRegistry;
  }

  async findFreeDevice(deviceQuery) {
    const { devices } = await this.adb.devices();
    for (const candidate of devices) {
      const isBusy = this.deviceRegistry.isDeviceBusy(candidate.adbName);
      if (isBusy) {
        log.debug({ event: DEVICE_LOOKUP_LOG_EVT }, `Device ${candidate.adbName} is busy, skipping...`);
        continue;
      }

      if (await this.isDeviceMatching(candidate, deviceQuery)) {
        log.debug({ event: DEVICE_LOOKUP_LOG_EVT }, `Found a matching free device ${candidate.adbName}`);
        return candidate.adbName;
      } else {
        log.debug({ event: DEVICE_LOOKUP_LOG_EVT }, `Device ${candidate.adbName} does not match "${deviceQuery}"`);
      }
    }

    return null;
  }

  /**
   * @protected
   * @return {Promise<boolean>} `true` when the `candidate` matches the `deviceQuery`
   */
  async isDeviceMatching(candidate, deviceQuery) {
    throw Error('Not implemented!');
  }
}

module.exports = FreeDeviceFinderBase;
