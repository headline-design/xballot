import { useTheme } from 'next-themes';
import { ButtonRounded } from './ButtonRounded';
import { SunIcon } from 'icons/SunIcon';
import { MoonIcon } from 'icons/Moon';
import Button from './BaseButton/BaseButton';
import { MoonAlt } from 'icons/MoonAlt';

export const ButtonTheme = () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <ButtonRounded
      className="text-skin-text hover:text-skin-link"
      onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
    >
      {resolvedTheme === 'light' ? <MoonIcon width={undefined} height={undefined} /> : <SunIcon width={undefined} height={undefined} />}
    </ButtonRounded>
  );
};

export const ButtonThemeAlt = () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      className=" text-skin-text hover:text-skin-link"
      onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
      onChange={undefined}
    >
      {resolvedTheme === 'light' ? <MoonAlt width="1em" height="1em" /> : <SunIcon width="1em" height="1em"/>}
    </Button>
  );
};
