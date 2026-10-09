import { Button } from '../../../../components/Button';
import { GenerationConfig } from '../../../../models/pokemon.model';
import { TabsContainer } from './styled';

export interface GenerationTabsProps {
  generations: GenerationConfig[];
  selectedGenId: string;
  onSelectGen: (gen: GenerationConfig) => void;
  disabled?: boolean;
}

export const GenerationTabs = ({
  generations,
  selectedGenId,
  onSelectGen,
  disabled = false,
}: GenerationTabsProps) => {
  return (
    <TabsContainer>
      {generations.map((gen) => (
        <Button
          key={gen.id}
          variant="generation"
          isActive={selectedGenId === gen.id}
          onClick={() => onSelectGen(gen)}
          disabled={disabled}
          size="sm"
        >
          {gen.label}
        </Button>
      ))}
    </TabsContainer>
  );
};
