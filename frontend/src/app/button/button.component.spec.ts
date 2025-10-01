import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';
import { By } from '@angular/platform-browser';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label', () => {
    component.label = 'Login';
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(btn.textContent.trim()).toBe('Login');
  });

  it('should apply primary color class by default', () => {
    const btn = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(btn.classList).toContain('btn-primary');
  });

  it('should apply danger color class', () => {
    component.color = 'danger';
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(btn.classList).toContain('btn-danger');
  });

  it('should disable button when disabled input is true', () => {
    component.disabled = true;
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(btn.disabled).toBeTrue();
  });

  it('should emit clicked event when button is clicked', () => {
    spyOn(component.clicked, 'emit');
    const btn = fixture.debugElement.query(By.css('button'));
    btn.triggerEventHandler('click');
    expect(component.clicked.emit).toHaveBeenCalled();
  });

  it('should not emit clicked event if disabled', () => {
    component.disabled = true;
    fixture.detectChanges();
    spyOn(component.clicked, 'emit');
    const btn = fixture.debugElement.query(By.css('button'));
    btn.triggerEventHandler('click');
    expect(component.clicked.emit).not.toHaveBeenCalled();
  });
});
