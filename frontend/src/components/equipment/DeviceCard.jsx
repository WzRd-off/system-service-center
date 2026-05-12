import { Link } from 'react-router-dom';
import { Button } from '../common/Button.jsx';

export function DeviceCard({ device, historyPath, onDelete }) {
  return (
    <div className="device-card">
      <h4>{device.type} {device.manufacturer} {device.model}</h4>
      {device.serial_number && <p>S/N: {device.serial_number}</p>}
      {device.notes && <small>{device.notes}</small>}
      <p className="device-card__actions">
        {historyPath && (
          <Link to={historyPath}>Історія заявок</Link>
        )}
        {onDelete && (
          <Button type="button" variant="ghost" onClick={() => onDelete(device)}>
            Видалити
          </Button>
        )}
      </p>
    </div>
  );
}
