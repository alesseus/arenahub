import { useEffect, useRef, type ReactNode } from 'react';
import './Modale.css';

type Props = {
    aperta: boolean;
    titolo: string;
    onChiudi: () => void;
    children: ReactNode;
};

function Modale({ aperta, titolo, onChiudi, children }: Props) {
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;
        if (aperta && !dialog.open) dialog.showModal();
        if (!aperta && dialog.open) dialog.close();
    }, [aperta]);

    return (
        <dialog
            ref={ref}
            className="modale"
            onClose={onChiudi}
            onClick={(e) => e.target === ref.current && onChiudi()}
        >
            <div className="modale-contenuto">
                <h2 className="modale-titolo">{titolo}</h2>
                {children}
            </div>
        </dialog>
    );
}

export default Modale;
