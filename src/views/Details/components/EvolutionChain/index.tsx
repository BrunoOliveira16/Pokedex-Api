import React, { useMemo } from 'react';

import { EvolutionNode, flattenEvolutionChain } from '../../../../models/pokemon.model';
import {
  ArrowIcon,
  ArrowWrapper,
  ChainContainer,
  EvolutionCard,
  EvolutionImage,
  NoEvolutionMessage,
  PokemonId,
  PokemonImageWrapper,
  PokemonName,
  TriggerBadge,
} from './styled';

export interface EvolutionChainProps {
  evolutions?: EvolutionNode[];
  chain?: EvolutionNode[] | EvolutionNode | null;
  currentPokemonId?: number;
  onSelectPokemon?: (id: number) => void;
  className?: string;
}

export const EvolutionChain = ({
  evolutions,
  chain,
  currentPokemonId,
  onSelectPokemon,
  className,
}: EvolutionChainProps) => {
  const nodes = useMemo(() => {
    if (evolutions && evolutions.length > 0) {
      return evolutions;
    }

    if (!chain) return [];

    if (Array.isArray(chain)) {
      if (chain.length === 1 && chain[0].evolvesTo?.length > 0) {
        return flattenEvolutionChain(chain[0]);
      }
      return chain;
    }
    return flattenEvolutionChain(chain);
  }, [evolutions, chain]);

  if (nodes.length <= 1) {
    return (
      <ChainContainer className={className}>
        <NoEvolutionMessage>Este Pokémon não possui evoluções.</NoEvolutionMessage>
      </ChainContainer>
    );
  }

  const formatTrigger = (node: EvolutionNode): string | null => {
    if (node.minLevel) return `Nv. ${node.minLevel}`;
    if (node.item) return node.item.replace(/-/g, ' ');
    if (node.trigger && node.trigger !== 'level-up') {
      return node.trigger.replace(/-/g, ' ');
    }
    return null;
  };

  return (
    <ChainContainer className={className}>
      {nodes.map((node, index) => {
        const isCurrent = currentPokemonId === node.id;
        const isClickable = Boolean(onSelectPokemon);
        const triggerLabel = formatTrigger(node);

        return (
          <React.Fragment key={node.id}>
            {index > 0 && (
              <ArrowWrapper>
                <ArrowIcon>➔</ArrowIcon>
                {triggerLabel && <TriggerBadge>{triggerLabel}</TriggerBadge>}
              </ArrowWrapper>
            )}

            <EvolutionCard
              $isCurrent={isCurrent}
              $isClickable={isClickable}
              onClick={() => onSelectPokemon?.(node.id)}
              role={isClickable ? 'button' : undefined}
              tabIndex={isClickable ? 0 : undefined}
            >
              <PokemonImageWrapper $isCurrent={isCurrent}>
                <EvolutionImage
                  src={node.photo}
                  alt={node.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/pokeball.svg';
                  }}
                />
              </PokemonImageWrapper>
              <PokemonName $isCurrent={isCurrent}>{node.name}</PokemonName>
              <PokemonId>#{String(node.id).padStart(3, '0')}</PokemonId>
            </EvolutionCard>
          </React.Fragment>
        );
      })}
    </ChainContainer>
  );
};
