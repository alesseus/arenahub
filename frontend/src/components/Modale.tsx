import { useEffect, useRef, type ReactNode } from 'react';
import './Modale.css';

type Props = {
    aperta: boolean;
    titolo?: string;
    etichetta?: string;
    larga?: boolean;
    onChiudi: () => void;
    children: ReactNode;
};

function Modale({ aperta, titolo, etichetta, larga = false, onChiudi, children }: Props) {
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
            className={larga ? 'modale is-larga' : 'modale'}
            aria-label={etichetta ?? titolo}
            onClose={onChiudi}
            onClick={(e) => e.target === ref.current && onChiudi()}
        >
            <button className="modale-chiudi" aria-label="Chiudi" onClick={onChiudi} />
            <div className="modale-contenuto">
                {titolo && <h2 className="modale-titolo">{titolo}</h2>}
                {children}
            </div>
        </dialog>
    );
}

export default Modale;
