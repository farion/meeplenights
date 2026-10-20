import { FormEvent, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDots, CaretDown, CaretLeft, CaretRight, Check, PencilSimple, Plus, Trash, UsersThree, X } from "@phosphor-icons/react";
import { api, CatalogueGame, GameNight, Player } from "./api";

function App() {
  const [nights, setNights] = useState<GameNight[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const activeNight = useMemo(() => nights.find((night) => night.id === activeId) ?? nights[0], [activeId, nights]);

  const load = useCallback(async () => {
    try {
      const [loadedNights, loadedPlayers] = await Promise.all([api.listNights(), api.listPlayers()]);
      setNights(loadedNights);
      setPlayers(loadedPlayers);
      setActiveId((current) => current ?? loadedNights[0]?.id ?? null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to reach the API");
    } finally { setIsLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  function replaceNight(updated: GameNight) {
    setNights((current) => current.map((night) => night.id === updated.id ? updated : night));
  }

  async function createNight(payload: Pick<GameNight, "title" | "scheduled_for" | "available_minutes">) {
    const night = await api.createNight(payload);
    setNights((current) => [night, ...current]);
    setActiveId(night.id);
  }

  async function update(action: () => Promise<GameNight>) {
    try { replaceNight(await action()); } catch (updateError) { setError(updateError instanceof Error ? updateError.message : "Update failed"); }
  }

  async function removeNight(nightId: number) {
    await api.deleteNight(nightId);
    const remainingNights = nights.filter((night) => night.id !== nightId);
    setNights(remainingNights);
    setActiveId((current) => current === nightId ? remainingNights[0]?.id ?? null : current);
  }

  async function updateNight(nightId: number, payload: Pick<GameNight, "title" | "scheduled_for" | "available_minutes">) {
    const night = await api.updateNight(nightId, payload);
    replaceNight(night);
    return night;
  }

  async function removeGame(nightId: number, gameId: number) {
    await api.removeGame(nightId, gameId);
    const night = await api.getNight(nightId);
    replaceNight(night);
  }

  async function createPlayer(name: string) {
    try {
      const player = await api.createPlayer(name);
      setPlayers((current) => [...current, player].sort((left, right) => left.name.localeCompare(right.name)));
      return player;
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Could not create attendee");
      return null;
    }
  }

  async function removePlayer(playerId: number) {
    await api.deletePlayer(playerId);
    setPlayers((current) => current.filter((player) => player.id !== playerId));
    setNights((current) => current.map((night) => ({
      ...night,
      attendees: night.attendees.filter((attendee) => attendee.id !== playerId),
    })));
  }

  return <main>
    <header className="app-header"><h1>Meeple Night</h1><div className="app-actions"><button type="button" className="create-icon-button" onClick={() => setCreating(true)} aria-label="Create game night"><Plus aria-hidden="true" weight="bold" /></button><NightPicker nights={nights} activeId={activeNight?.id ?? null} onSelect={setActiveId} /></div></header>
    {error && <p className="error">{error}</p>}
    {creating && <CreateNightDialog onClose={() => setCreating(false)} onCreate={createNight} />}
    <section className="detail">
      {activeNight ? <NightDetail night={activeNight} players={players} update={update} updateNight={updateNight} removeNight={removeNight} removeGame={removeGame} createPlayer={createPlayer} removePlayer={removePlayer} /> : !isLoading && <EmptyState onCreate={() => setCreating(true)} />}
    </section>
  </main>;
}

function EmptyState({ onCreate }: { onCreate: () => void }) { return <div className="empty-state"><h2>Your table is waiting</h2><p className="empty-hint">Create a game night to begin planning.</p><button type="button" className="empty-create-button" onClick={onCreate}><Plus aria-hidden="true" weight="bold" /> Create game night</button></div>; }

function ModalLayer({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) { if (event.key === "Escape") onClose(); }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);
  return createPortal(<div className="modal-layer" onPointerDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>{children}</div>, document.body);
}

function NightPicker({ nights, activeId, onSelect }: { nights: GameNight[]; activeId: number | null; onSelect: (nightId: number) => void }) {
  const [open, setOpen] = useState(false);
  const [opensUpward, setOpensUpward] = useState(false);
  const pickerRef = useOutsideDismiss<HTMLDivElement>(open, () => setOpen(false));
  const activeNight = nights.find((night) => night.id === activeId);
  return <div className="night-picker" ref={pickerRef}>
    <button type="button" className="night-picker-trigger" disabled={nights.length === 0} onClick={() => { if (open) setOpen(false); else { setOpensUpward(shouldOpenUpward(pickerRef.current, 280)); setOpen(true); } }} aria-expanded={open}>
      <span>{activeNight?.title ?? "No game nights"}</span><CaretDown aria-hidden="true" weight="bold" />
    </button>
    {open && <div className={`night-picker-popover ${opensUpward ? "opens-upward" : ""}`}>
      {nights.map((night) => <button type="button" className={night.id === activeId ? "active" : ""} key={night.id} disabled={night.id === activeId} onClick={() => { onSelect(night.id); setOpen(false); }}><strong>{night.title}</strong><small>{night.scheduled_for} · {night.available_minutes} min</small></button>)}
    </div>}
  </div>;
}

type NightFieldErrors = Partial<Record<"title" | "date" | "minutes", string>>;

function readNightForm(form: FormData): { payload?: Pick<GameNight, "title" | "scheduled_for" | "available_minutes">; errors: NightFieldErrors } {
  const title = String(form.get("title") ?? "").trim();
  const scheduledFor = String(form.get("date") ?? "");
  const availableMinutes = Number(form.get("minutes"));
  const errors: NightFieldErrors = {};
  if (!title) errors.title = "Enter a title.";
  if (!scheduledFor) errors.date = "Choose a date.";
  if (!Number.isInteger(availableMinutes) || availableMinutes < 30 || availableMinutes > 720) errors.minutes = "Enter 30 to 720 minutes.";
  return Object.keys(errors).length > 0 ? { errors } : { payload: { title, scheduled_for: scheduledFor, available_minutes: availableMinutes }, errors };
}

function CreateNightDialog({ onClose, onCreate }: { onClose: () => void; onCreate: (payload: Pick<GameNight, "title" | "scheduled_for" | "available_minutes">) => Promise<void> }) {
  const [fieldErrors, setFieldErrors] = useState<NightFieldErrors>({});
  const { closing, close } = useDialogClose(onClose);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const { payload, errors } = readNightForm(form);
    if (!payload) { setFieldErrors(errors); return; }
    try {
      await onCreate(payload);
      close();
    } catch (error) { setFieldErrors({ title: error instanceof Error ? error.message : "Could not create game night." }); }
  }
  return <ModalLayer onClose={close}><dialog className={`modal ${closing ? "is-closing" : ""}`} open aria-labelledby="create-night-title">
    <form noValidate onSubmit={submit}>
      <div className="modal-heading"><h2 id="create-night-title">Create game night</h2><button type="button" className="icon-button" onClick={close} aria-label="Close dialog">×</button></div>
      <label>Title<input name="title" placeholder="Friday at Jordan's" onChange={() => setFieldErrors((current) => ({ ...current, title: undefined }))} />{fieldErrors.title && <small className="field-error" role="alert">{fieldErrors.title}</small>}</label>
      <DateField name="date" label="Date" error={fieldErrors.date} onValueChange={() => setFieldErrors((current) => ({ ...current, date: undefined }))} />
      <label>Available minutes<input name="minutes" type="number" min="30" max="720" defaultValue="180" onChange={() => setFieldErrors((current) => ({ ...current, minutes: undefined }))} />{fieldErrors.minutes && <small className="field-error" role="alert">{fieldErrors.minutes}</small>}</label>
       <div className="modal-actions"><button type="button" className="secondary-action" onClick={close}><X aria-hidden="true" weight="bold" />Cancel</button><button type="submit"><Plus aria-hidden="true" weight="bold" />Create game night</button></div>
    </form>
  </dialog></ModalLayer>;
}

function NightDetail({ night, players, update, updateNight, removeNight, removeGame, createPlayer, removePlayer }: { night: GameNight; players: Player[]; update: (action: () => Promise<GameNight>) => Promise<void>; updateNight: (nightId: number, payload: Pick<GameNight, "title" | "scheduled_for" | "available_minutes">) => Promise<GameNight>; removeNight: (nightId: number) => Promise<void>; removeGame: (nightId: number, gameId: number) => Promise<void>; createPlayer: (name: string) => Promise<Player | null>; removePlayer: (playerId: number) => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [removingGame, setRemovingGame] = useState<{ id: number; name: string } | null>(null);
  const [removingAttendee, setRemovingAttendee] = useState<Player | null>(null);
  const [managingAttendees, setManagingAttendees] = useState(false);

  return <>
    <div className="title-row"><div className="night-heading"><div className="night-title-line"><h2>{night.title}</h2><div className="title-actions"><button type="button" className="title-icon-button" onClick={() => setEditing(true)} aria-label="Edit game night"><PencilSimple aria-hidden="true" weight="bold" /></button><button type="button" className="title-icon-button danger-icon" onClick={() => setDeleting(true)} aria-label="Delete game night"><Trash aria-hidden="true" weight="bold" /></button></div></div><p>{night.scheduled_for} · {night.available_minutes} minutes available</p></div></div>
    {editing && <EditNightDialog night={night} onSave={updateNight} onClose={() => setEditing(false)} />}
    {deleting && <DeleteNightDialog nightTitle={night.title} onClose={() => setDeleting(false)} onConfirm={() => removeNight(night.id)} />}
    {removingGame && <DeleteGameDialog gameName={removingGame.name} onClose={() => setRemovingGame(null)} onConfirm={() => removeGame(night.id, removingGame.id)} />}
    {removingAttendee && <RemoveAttendeeDialog personName={removingAttendee.name} onClose={() => setRemovingAttendee(null)} onConfirm={() => update(async () => { await api.removeAttendee(night.id, removingAttendee.id); return api.getNight(night.id); })} />}
    {managingAttendees && <AttendeeManagerDialog night={night} players={players} createPlayer={createPlayer} removePlayer={removePlayer} update={update} onClose={() => setManagingAttendees(false)} />}
    <div className="columns">
      <section className="card"><div className="section-heading"><h3>Attendees <span>{night.attendees.length}</span></h3><button type="button" className="title-icon-button" onClick={() => setManagingAttendees(true)} aria-label="Manage attendees"><UsersThree aria-hidden="true" weight="bold" /></button></div>
        <div className="attendee-list">{night.attendees.map((player) => <div className="attendee" key={player.id}><span>{player.name}</span><button type="button" className="remove-attendee" onClick={() => setRemovingAttendee(player)} aria-label={`Remove ${player.name}`}><Trash aria-hidden="true" weight="bold" /></button></div>)}</div>
        {players.length > 0 ? <AttendeePicker night={night} players={players} update={update} /> : <div className="attendee-empty-state"><p className="attendee-hint">No attendees yet.</p></div>}
      </section>
      <section className="card"><h3>Candidate games <span>{night.games.length}</span></h3>
        <div className="game-list">{night.games.map((game) => <div className="game" key={game.id}><div><strong>{game.name}</strong><small>{game.min_players}–{game.max_players} players · {game.duration_minutes} min</small></div><div className="game-actions"><button type="button" className="remove-game" onClick={() => setRemovingGame({ id: game.id, name: game.name })} aria-label={`Remove ${game.name}`}><Trash aria-hidden="true" weight="bold" /></button></div></div>)}</div>
        {night.games.length === 0 && <p className="game-hint">Add a game from the catalogue to begin planning.</p>}
        <GamePicker night={night} update={update} />
      </section>
    </div>
  </>;
}

function AttendeePicker({ night, players, update }: { night: GameNight; players: Player[]; update: (action: () => Promise<GameNight>) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [opensUpward, setOpensUpward] = useState(false);
  const pickerRef = useOutsideDismiss<HTMLDivElement>(open, () => setOpen(false));
  const availablePlayers = players.filter((player) => !night.attendees.some((attendee) => attendee.id === player.id));

  return <div className="attendee-picker" ref={pickerRef}>
    <button type="button" className="picker-trigger" onClick={() => { if (open) setOpen(false); else { setOpensUpward(shouldOpenUpward(pickerRef.current, 290)); setOpen(true); } }} aria-expanded={open}>Add an attendee <CaretDown aria-hidden="true" weight="bold" /></button>
    {open && <div className={`attendee-popover ${opensUpward ? "opens-upward" : ""}`}>
      {availablePlayers.length > 0 && <div className="attendee-options">{availablePlayers.map((player) => <div className="attendee-option" key={player.id}><button type="button" onClick={() => { void update(() => api.addAttendee(night.id, player.id)); setOpen(false); }}>{player.name}</button></div>)}</div>}
      {availablePlayers.length === 0 && <p className="picker-hint">No more attendees available.</p>}
    </div>}
  </div>;
}

function AttendeeManagerDialog({ night, players, createPlayer, removePlayer, update, onClose }: { night: GameNight; players: Player[]; createPlayer: (name: string) => Promise<Player | null>; removePlayer: (playerId: number) => Promise<void>; update: (action: () => Promise<GameNight>) => Promise<void>; onClose: () => void }) {
  const [name, setName] = useState("");
  const [deletingPerson, setDeletingPerson] = useState<Player | null>(null);
  async function addPerson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const person = await createPlayer(name.trim());
    if (!person) return;
    await update(() => api.addAttendee(night.id, person.id));
    setName("");
  }
  return <ModalLayer onClose={onClose}><dialog className="modal attendee-manager-modal" open aria-labelledby="manage-attendees-title">
    <div className="modal-heading"><h2 id="manage-attendees-title">Manage attendees</h2><button type="button" className="icon-button" onClick={onClose} aria-label="Close dialog">×</button></div>
    <form className="attendee-create" onSubmit={addPerson}><input value={name} onChange={(event) => setName(event.target.value)} placeholder="New attendee name" aria-label="New attendee name" /><button type="submit" disabled={!name.trim()} aria-label="Add attendee"><Plus aria-hidden="true" weight="bold" /></button></form>
    <div className="attendee-manager-list">{players.map((player) => <div className="attendee" key={player.id}><span>{player.name}</span><button type="button" className="remove-attendee" onClick={() => setDeletingPerson(player)} aria-label={`Delete ${player.name}`}><Trash aria-hidden="true" weight="bold" /></button></div>)}</div>
    {players.length === 0 && <p className="picker-hint">Create your first attendee above.</p>}
    {deletingPerson && <DeletePersonDialog personName={deletingPerson.name} onClose={() => setDeletingPerson(null)} onConfirm={() => removePlayer(deletingPerson.id)} />}
  </dialog></ModalLayer>;
}

function DateField({ name, label, defaultValue, error, onValueChange }: { name: string; label: string; defaultValue?: string; error?: string; onValueChange?: () => void }) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const [opensUpward, setOpensUpward] = useState(false);
  const dateFieldRef = useOutsideDismiss<HTMLDivElement>(open, () => setOpen(false));
  const initialDate = defaultValue ? new Date(`${defaultValue}T12:00:00`) : new Date();
  const [viewMonth, setViewMonth] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
  const selectedDate = value ? new Date(`${value}T12:00:00`) : null;
  const monthLabel = viewMonth.toLocaleString("en-US", { month: "long", year: "numeric" });
  const firstWeekday = (viewMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
  const cells = Array.from({ length: firstWeekday + daysInMonth }, (_, index) => index < firstWeekday ? null : index - firstWeekday + 1);

  function chooseDay(day: number) {
    const formatted = `${viewMonth.getFullYear()}-${String(viewMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setValue(formatted);
    onValueChange?.();
    setOpen(false);
  }

  return <div className={`date-field ${error ? "has-error" : ""}`} ref={dateFieldRef}>
    <span className="date-label">{label}</span>
    <input name={name} type="hidden" value={value} readOnly />
    <button type="button" className="date-trigger" onClick={() => { if (open) setOpen(false); else { setOpensUpward(shouldOpenUpward(dateFieldRef.current, 320)); setOpen(true); } }} aria-expanded={open} aria-haspopup="dialog">
      <span>{value || "Select date"}</span><CalendarDots aria-hidden="true" size={21} weight="bold" />
    </button>
    {open && <div className={`calendar-popover ${opensUpward ? "opens-upward" : ""}`} role="dialog" aria-label="Choose date">
      <div className="calendar-header"><button type="button" className="calendar-nav" onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))} aria-label="Previous month"><CaretLeft weight="bold" /></button><strong>{monthLabel}</strong><button type="button" className="calendar-nav" onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))} aria-label="Next month"><CaretRight weight="bold" /></button></div>
      <div className="calendar-weekdays">{["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => <span key={day}>{day}</span>)}</div>
      <div className="calendar-days">{cells.map((day, index) => day === null ? <span key={`empty-${index}`} /> : <button type="button" key={day} className={selectedDate?.getFullYear() === viewMonth.getFullYear() && selectedDate?.getMonth() === viewMonth.getMonth() && selectedDate?.getDate() === day ? "selected-day" : ""} onClick={() => chooseDay(day)}>{day}</button>)}</div>
    </div>}
    {error && <small className="field-error" role="alert">{error}</small>}
  </div>;
}

function useOutsideDismiss<T extends HTMLElement>(open: boolean, dismiss: () => void) {
  const elementRef = useRef<T>(null);
  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: PointerEvent) {
      if (!elementRef.current?.contains(event.target as Node)) dismiss();
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") dismiss();
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, dismiss]);
  return elementRef;
}

function shouldOpenUpward(element: HTMLElement | null, popoverHeight: number) {
  if (!element) return false;
  const bounds = element.getBoundingClientRect();
  const spaceBelow = window.innerHeight - bounds.bottom;
  const spaceAbove = bounds.top;
  return spaceBelow < popoverHeight && spaceAbove > spaceBelow;
}

function useDialogClose(onClose: () => void) {
  const [closing, setClosing] = useState(false);
  function close() {
    if (closing) return;
    setClosing(true);
    window.setTimeout(onClose, 260);
  }
  return { closing, close };
}

function EditNightDialog({ night, onSave, onClose }: { night: GameNight; onSave: (nightId: number, payload: Pick<GameNight, "title" | "scheduled_for" | "available_minutes">) => Promise<GameNight>; onClose: () => void }) {
  const [fieldErrors, setFieldErrors] = useState<NightFieldErrors>({});
  const { closing, close } = useDialogClose(onClose);
  async function saveNight(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const { payload, errors } = readNightForm(form);
    if (!payload) { setFieldErrors(errors); return; }
    try {
      await onSave(night.id, payload);
      close();
    } catch (error) { setFieldErrors({ title: error instanceof Error ? error.message : "Could not save changes." }); }
  }
  return <ModalLayer onClose={close}><dialog className={`modal ${closing ? "is-closing" : ""}`} open aria-labelledby="edit-night-title">
    <form noValidate onSubmit={saveNight}>
      <div className="modal-heading"><h2 id="edit-night-title">Edit game night</h2><button type="button" className="icon-button" onClick={close} aria-label="Close dialog">×</button></div>
      <label>Title<input name="title" defaultValue={night.title} onChange={() => setFieldErrors((current) => ({ ...current, title: undefined }))} />{fieldErrors.title && <small className="field-error" role="alert">{fieldErrors.title}</small>}</label>
      <DateField name="date" label="Date" defaultValue={night.scheduled_for} error={fieldErrors.date} onValueChange={() => setFieldErrors((current) => ({ ...current, date: undefined }))} />
      <label>Available minutes<input name="minutes" type="number" min="30" max="720" defaultValue={night.available_minutes} onChange={() => setFieldErrors((current) => ({ ...current, minutes: undefined }))} />{fieldErrors.minutes && <small className="field-error" role="alert">{fieldErrors.minutes}</small>}</label>
       <div className="modal-actions"><button type="button" className="secondary-action" onClick={close}><X aria-hidden="true" weight="bold" />Cancel</button><button type="submit"><Check aria-hidden="true" weight="bold" />Save changes</button></div>
    </form>
  </dialog></ModalLayer>;
}

function DeleteNightDialog({ nightTitle, onClose, onConfirm }: { nightTitle: string; onClose: () => void; onConfirm: () => Promise<void> }) {
  const [submitError, setSubmitError] = useState("");
  async function confirm() {
    try { await onConfirm(); onClose(); } catch (error) { setSubmitError(error instanceof Error ? error.message : "Could not delete game night."); }
  }
  return <ModalLayer onClose={onClose}><dialog className="modal confirm-modal" open aria-labelledby="delete-night-title">
    <div className="modal-heading"><h2 id="delete-night-title">Delete game night?</h2><button type="button" className="icon-button" onClick={onClose} aria-label="Close dialog">×</button></div>
    <p>“{nightTitle}” and its attendee and game assignments will be removed permanently.</p>
    {submitError && <p className="form-error" role="alert">{submitError}</p>}
    <div className="modal-actions"><button type="button" className="secondary-action" onClick={onClose}><X aria-hidden="true" weight="bold" />Cancel</button><button type="button" className="danger-action" onClick={() => void confirm()}><Trash aria-hidden="true" weight="bold" />Delete game night</button></div>
  </dialog></ModalLayer>;
}

function DeleteGameDialog({ gameName, onClose, onConfirm }: { gameName: string; onClose: () => void; onConfirm: () => Promise<void> }) {
  const [submitError, setSubmitError] = useState("");
  async function confirm() {
    try { await onConfirm(); onClose(); } catch (error) { setSubmitError(error instanceof Error ? error.message : "Could not remove game."); }
  }
  return <ModalLayer onClose={onClose}><dialog className="modal confirm-modal" open aria-labelledby="delete-game-title">
    <div className="modal-heading"><h2 id="delete-game-title">Remove game?</h2><button type="button" className="icon-button" onClick={onClose} aria-label="Close dialog">×</button></div>
    <p>“{gameName}” will be removed from this game night.</p>
    {submitError && <p className="form-error" role="alert">{submitError}</p>}
    <div className="modal-actions"><button type="button" className="secondary-action" onClick={onClose}><X aria-hidden="true" weight="bold" />Cancel</button><button type="button" className="danger-action" onClick={() => void confirm()}><Trash aria-hidden="true" weight="bold" />Remove game</button></div>
  </dialog></ModalLayer>;
}

function RemoveAttendeeDialog({ personName, onClose, onConfirm }: { personName: string; onClose: () => void; onConfirm: () => Promise<void> }) {
  const [submitError, setSubmitError] = useState("");
  async function confirm() {
    try { await onConfirm(); onClose(); } catch (error) { setSubmitError(error instanceof Error ? error.message : "Could not remove attendee."); }
  }
  return <ModalLayer onClose={onClose}><dialog className="modal confirm-modal" open aria-labelledby="remove-attendee-title">
    <div className="modal-heading"><h2 id="remove-attendee-title">Remove attendee?</h2><button type="button" className="icon-button" onClick={onClose} aria-label="Close dialog">×</button></div>
    <p>Remove “{personName}” from this game night?</p>
    {submitError && <p className="form-error" role="alert">{submitError}</p>}
    <div className="modal-actions"><button type="button" className="secondary-action" onClick={onClose}><X aria-hidden="true" weight="bold" />Cancel</button><button type="button" className="danger-action" onClick={() => void confirm()}><Trash aria-hidden="true" weight="bold" />Remove attendee</button></div>
  </dialog></ModalLayer>;
}

function DeletePersonDialog({ personName, onClose, onConfirm }: { personName: string; onClose: () => void; onConfirm: () => Promise<void> }) {
  const [submitError, setSubmitError] = useState("");
  async function confirm() {
    try { await onConfirm(); onClose(); } catch (error) { setSubmitError(error instanceof Error ? error.message : "Could not delete attendee."); }
  }
  return <ModalLayer onClose={onClose}><dialog className="modal confirm-modal" open aria-labelledby="delete-person-title">
    <div className="modal-heading"><h2 id="delete-person-title">Delete person?</h2><button type="button" className="icon-button" onClick={onClose} aria-label="Close dialog">×</button></div>
    <p>“{personName}” will be removed from every game night.</p>
    {submitError && <p className="form-error" role="alert">{submitError}</p>}
    <div className="modal-actions"><button type="button" className="secondary-action" onClick={onClose}><X aria-hidden="true" weight="bold" />Cancel</button><button type="button" className="danger-action" onClick={() => void confirm()}><Trash aria-hidden="true" weight="bold" />Delete person</button></div>
  </dialog></ModalLayer>;
}

function GamePicker({ night, update }: { night: GameNight; update: (action: () => Promise<GameNight>) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [opensUpward, setOpensUpward] = useState(false);
  const [query, setQuery] = useState("");
  const [games, setGames] = useState<CatalogueGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pickerRef = useOutsideDismiss<HTMLDivElement>(open, () => setOpen(false));

  useEffect(() => {
    if (!open) return;
    const trimmedQuery = query.trim();
    if (trimmedQuery.length === 1) {
      setGames([]);
      return;
    }
    const timer = window.setTimeout(() => {
      setLoading(true);
      setError("");
      const loadGames = trimmedQuery.length >= 2 ? api.searchGames(trimmedQuery) : api.popularGames();
      void loadGames
        .then(setGames)
        .catch((loadError: unknown) => setError(loadError instanceof Error ? loadError.message : "Could not load games"))
        .finally(() => setLoading(false));
    }, trimmedQuery.length >= 2 ? 300 : 0);
    return () => window.clearTimeout(timer);
  }, [open, query]);

  async function chooseGame(game: CatalogueGame) {
    await update(() => api.addCatalogueGame(night.id, game.catalogue_id));
    setOpen(false);
    setQuery("");
  }

  return <div className="game-picker" ref={pickerRef}>
    <button className="picker-trigger" type="button" onClick={() => { if (open) setOpen(false); else { setOpensUpward(shouldOpenUpward(pickerRef.current, 385)); setOpen(true); } }} aria-expanded={open}>
      Add a game from the catalogue <CaretDown aria-hidden="true" weight="bold" />
    </button>
    {open && <div className={`picker-popover ${opensUpward ? "opens-upward" : ""}`}>
      <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search games…" aria-label="Search games" />
      {query.trim().length === 1 && <p className="picker-hint">Type one more character to search.</p>}
      {loading && <p className="picker-hint">Loading games…</p>}
      {error && <p className="picker-error">{error}</p>}
      {!loading && !error && games.length > 0 && <div className="picker-results">
        {games.map((game) => <button type="button" className="picker-game" key={game.catalogue_id} onClick={() => void chooseGame(game)}>
          <strong>{game.name}</strong>
          <span>{game.min_players}–{game.max_players} players · {game.duration_minutes || "?"} min</span>
        </button>)}
      </div>}
      {!loading && !error && query.trim().length !== 1 && games.length === 0 && <p className="picker-hint">No games found.</p>}
    </div>}
  </div>;
}

export default App;
