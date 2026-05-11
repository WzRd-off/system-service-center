import { Link } from 'react-router-dom';

export function DeviceCard({ device, historyPath }) {
  return (
    <div className="device-card">
      <h4>{device.type} {device.manufacturer} {device.model}</h4>
      {device.serial_number && <p>S/N: {device.serial_number}</p>}
      {device.notes && <small>{device.notes}</small>}
      {historyPath && (
        <p className="device-card__actions">
          <Link to={historyPath}>Історія заявок</Link>
        </p>
      )}
    </div>
  );
}
