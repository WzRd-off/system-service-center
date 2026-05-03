export function DeviceCard({ device }) {
  return (
    <div className="device-card">
      <h4>{device.type} {device.manufacturer} {device.model}</h4>
      {device.serial_number && <p>S/N: {device.serial_number}</p>}
      {device.notes && <small>{device.notes}</small>}
    </div>
  );
}
